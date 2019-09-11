<asset:javascript src="jquery-3.3.1.min.js"/>
<script src="//mozilla.github.io/pdf.js/build/pdf.js"></script>

<style type="text/css">
    #tap_tempo {
        position: relative;
        float: left;
        margin: 10px;
    }
    #save_tap_list {
        /* float: left; */
        position: relative;

        margin: 10px;
    }
    #prev_page {
        margin: 10px;
    }
    #next_page {
        margin: 10px;
    }
    #page_count {
        float: left;
        margin: 10px;
    }
</style>

<div>

    <div>
        <h1>Audio Player</h1>
        <audio id="audio_player" controls preload="auto">
            <source src="${recording.digitalAudio}"/> type="audio/mp3">
        Your browser does not support the audio element. </audio>

    </div>


    <div id="score">
        <canvas id="score_canvas_left"></canvas>
        <canvas id="score_canvas_right"></canvas>
        <div>
            <div id="page_count"></div>
            <button id="prev_page"> prev. </button>
            <button id="next_page"> next </button>
        </div>

    </div>


    <div>
        <h1>Tap Tempo</h1>
        <button id="tap_tempo">Tap Tempo</button>
        <button id="save_tap_list">Save 0 Samples</button>
        <div id="tap_ist"></div>
    </div>



    <div>
        <h1>Visual Data</h1>
        <canvas id="viz" style="border:1px solid #d3d3d3;"></canvas>
    </div>

</div>

<script type="application/javascript">
    // score stuff
    var pdfjsLib = window['pdfjs-dist/build/pdf'];
    // The workerSrc property shall be specified.
    pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

    var pdfDoc = null,
        pageNum = 1,
        pageRendering = {"left": false, "right": false},
        pageNumPending = {"left": null, "right": null},
        scale = 0.8,
        score_canvas = {
            "left": document.getElementById('score_canvas_left'),
            "right": document.getElementById('score_canvas_right')
        },
        score_ctx = {
            "left": score_canvas["left"].getContext('2d'),
            "right": score_canvas["right"].getContext('2d')
        };


    function renderPage(canvas, num) {
        pageRendering[canvas] = true;
        // Using promise to fetch the page
        pdfDoc.getPage(num).then(function (page) {
            var viewport = page.getViewport({scale: scale});
            score_canvas[canvas].height = viewport.height;
            score_canvas[canvas].width = viewport.width;

            // Render PDF page into canvas context
            var renderContext = {
                canvasContext: score_ctx[canvas],
                viewport: viewport
            };
            console.log("rendering; " + num + " to the " + canvas);
            var renderTask = page.render(renderContext);

            // Wait for rendering to finish
            renderTask.promise.then(function () {
                pageRendering[canvas] = false;
                if (pageNumPending[canvas] !== null) {
                    // New page rendering is pending
                    renderPage(canvas, pageNumPending);
                    pageNumPending[canvas] = null;
                }
            });
        });
    }


    /**
     * If another page rendering in progress, waits until the rendering is
     * finised. Otherwise, executes rendering immediately.
     */
    function queueRenderPage(canvas, num) {
        if (pageRendering[canvas]) {
            pageNumPending[canvas] = num;
        } else {
            renderPage(canvas, num);
        }
    }

    /**
     * Displays previous page.
     */
    $(function() {
        $("#prev_page").on("click", function() {
            onPrevPage();
        });
    });
    function onPrevPage() {
        if (pageNum <= 1) {
            return;
        }
        pageNum--;
        queueRenderPage("left", pageNum);
        queueRenderPage("right", pageNum + 1);
    }

    /**
     * Displays next page.
     */
    $(function() {
        $("#next_page").on("click", function() {
            onNextPage();
        });
    });
    function onNextPage() {
        if (pageNum >= pdfDoc.numPages) {
            return;
        }
        pageNum++;
        queueRenderPage("left", pageNum);
        if (pageNum < pdfDoc.numPages) {
            queueRenderPage("right", pageNum+1);
        } else {
            console.log("TODO: clear canvas");
        }

    }


    pdfjsLib.getDocument("${this.recording.abstractMusicPart.pdfLocation}").promise.then(function(pdfDoc_) {
        pdfDoc = pdfDoc_;
        document.getElementById('page_count').textContent = pdfDoc.numPages + " pages";

        // Initial/first page rendering
        renderPage("left", pageNum);
        renderPage("right", pageNum+1);
    });

</script>

<script type="application/javascript">
    // tap tempo and data viz

    // state for event collection
    var timer = 0.0;
    var tapList = [];


    function uploadTapData() {

        var ajaxUrl="${createLink(controller:'recording',action:'ajaxUploadTapData')}";

        $.ajax({
            url:ajaxUrl,
            data: {
                tapList: tapList.join(";"),
                recording: "${recording.id}"
            },
            success: function(resp){
                console.log(resp);



                if (resp["Error"]) {
                    console.log(resp["Error"]);
                    return;
                }

                tapList = [];
                $("#save_tap_list").text("Saved!");

            }
        });


    }

    // getter and setter
    function updateTimer(time) {
        timer = time;
        drawPlayHead(time);
    }

    function updateTapTempo(time) {
        tapList.push(time);
        drawTapPoint(time);

        $("#tap_list").text(tapList.length);
        $("#save_tap_list").text("Save " + tapList.length + " Samples")
    }

    function audioPlayerLog(msg) {
        //$('<p>' + msg + '</p>').prependTo('#audio_player_console');
        console.log(msg);
    }


    // event handler
    $(function () {
        $('#audio_player').on('play', function () {
            audioPlayerLog("play");
        });
    });

    $(function () {
        $('#audio_player').on('timeupdate', function () {
            //audioPlayerLog("ontimeupdate");
            var widget = document.getElementById("audio_player");
            if (widget.paused) {
                audioPlayerLog("prepared to play " + widget.currentTime);
            } else {
                //audioPlayerLog("playing " + widget.currentTime);
                updateTimer(widget.currentTime);
                drawPlayHead(widget.currentTime);
            }
            clearCanvas(widget.currentTime);

        });
    });

    $(function() {
       $("#tap_tempo").on("click", function() {
           var widget = document.getElementById("audio_player");

           if (widget.paused) {
               // no action
           } else {
               audioPlayerLog("tap at play head pos " + widget.currentTime);
               updateTapTempo(widget.currentTime);
           }
       });
    });


    $(function() {
        $("#save_tap_list").on("click", function() {
            uploadTapData();
        });
    });


    var canvas; // html canvas element
    var vizStartTime; // offset for visualization
    var vizDuration; // seconds
    var ctx; // context

    // init
    function initCanvas() {
        canvas = document.getElementById("viz");
        vizStartTime = 0.0; // offset. beginning of viz
        vizDuration = 30.0; // length of viz in seconds
        canvas.width = window.innerWidth; // todo: react to changing window size
        canvas.height = 200;
        console.log(canvas.width);
        ctx = canvas.getContext("2d");
    }


    function drawAnnotations() {
        // existing data
        <g:applyCodec encodeAs="none">
        var annotationSessions = ${this.annotationSessionsJson};
        </g:applyCodec>

        //console.log(annotationSessions);

        // var sampleRate = 44100;
        // var sampleLength = 1.0 / sampleRate;

        for (var i = 0; i < annotationSessions.length; i++) {
            for (var j = 0; j < annotationSessions[i].annotations.length; j++) {
                var eventTime = annotationSessions[i].annotations[j].momentOfPerception;
                var eventType = annotationSessions[i].annotations[j].type;

                if (eventTime > vizStartTime && eventTime < (vizStartTime + vizDuration)) {
                    // Assert: drawEvent will NEVER trigger clearCanvas, because start and endtime match
                    drawEvent(eventType, eventTime);
                }
                if (eventTime > (vizStartTime + vizDuration)) {
                    // break inner loop
                    j = annotationSessions[i].annotations.length;
                }
            }
        }
    }


    /**
     * when time moves on, the visualization needs to be refreshed to the
     * right time window
     * @param time
     */
    function clearCanvas(time) {
        // necessary?
        if (time > vizStartTime && time < (vizStartTime + vizDuration)) {
            //console.log("unnecessary");
            return;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        vizStartTime = time;

        var t0 = performance.now();
        drawAnnotations();
        var t1 = performance.now();
        console.log("Call to drawAnnotations took " + (t1 - t0) + " milliseconds.");
    }



    // maps a time event (tap at second 5.67) to x coords in the canvas
    // depending on width and viz duration
    function mapTime(time) {

        if (time > vizStartTime + vizDuration) {
            // redraw canvas and update startTime
            clearCanvas(time);
        }
        if (time < vizStartTime) {
            // redraw canvas and update startTime
            clearCanvas(time);
        }

        var pixPerSec = canvas.width / vizDuration;
        return (time - vizStartTime) * pixPerSec;
    }


    function drawEvent(type, time) {
        var pointRadius = 4;
        var x = mapTime(time);
        var y = canvas.height - 10;
        ctx.beginPath();
        ctx.arc(x, y, pointRadius, 0, 2 * Math.PI);
        ctx.stroke();
    }


    function drawTapPoint(time) {
        var pointRadius = 3;
        var x = mapTime(time);
        var y = canvas.height / 2;
        ctx.beginPath();
        ctx.arc(x, y, pointRadius, 0, 2 * Math.PI);
        ctx.stroke();
    }

    function drawPlayHead(time) {
        var pointRadius = 2;
        var x = mapTime(time);
        var y = canvas.height - 4;
        ctx.beginPath();
        ctx.arc(x, y, pointRadius, 0, 2 * Math.PI);
        ctx.stroke();
    }


    initCanvas();
    clearCanvas(0.0);


</script>

