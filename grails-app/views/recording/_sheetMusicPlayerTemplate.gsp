
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-contextmenu/2.7.1/jquery.contextMenu.min.css">

<script type="application/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery-contextmenu/2.7.1/jquery.contextMenu.min.js"></script>

<script type="application/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery-contextmenu/2.7.1/jquery.ui.position.js"></script>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">


<script src="//mozilla.github.io/pdf.js/build/pdf.js"></script>

<script src="https://unpkg.com/wavesurfer.js"></script>


<style type="text/css">
    #tap_tempo {
        position: relative;
        /* float: left; */
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
        /* float: left; */
        margin: 10px;
    }
</style>


<!-- HTML -->
<div>

    <div>
        <audio id="audio_player" controls preload="auto">
            <source src="${  createLink(controller: 'recording', action: 'getAudioFile', id: recording.id) }"/> type="audio/wav">
        Your browser does not support the audio element. </audio>
    </div>


    <div>
        <canvas id="viz" style="border:1px solid #d3d3d3;"></canvas>
    </div>
<!--
    <div>
        <div id="waveform"></div>
    </div>
-->

    <div class="buttons">
        <input type="text" id="new_annotation" placeholder="Type any Annotation" />
        <button id="add_new_annotation"> Add Now </button>


        <button id="tap_tempo">Tap Tempo</button>
        <button id="discard_tap_list">Discard 0 Samples</button>
        <button id="save_tap_list">Save 0 Samples</button>

        Zoom Score
        <button id="score_zoom_out"> - </button>
        <button id="score_zoom_in"> + </button>

        <span id="page_count"></span>
        <button id="prev_page"> Prev. </button>
        <button id="next_page"> Next </button>


    <div id="tap_ist"></div>
    </div>





    <div id="score">
        <canvas id="score_canvas_left"></canvas>
        <canvas id="score_canvas_right"></canvas>
        <div class="buttons">


        </div>

    </div>

</div>



<!-- Script -->

<script type="application/javascript">
/*
    var wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: 'violet',
        progressColor: 'purple'
    });

    wavesurfer.on('ready', function () {
        wavesurfer.play();
        console.log("Play!");
    });

    //TODO: CORS issue!
    wavesurfer.load('${recording.digitalAudio}');

*/
</script>

<script type="application/javascript">
    // score pdf stuff
    let pdfjsLib = window['pdfjs-dist/build/pdf'];
    // The workerSrc property shall be specified.
    pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

    let pdfDoc = null,
        pageNum = 1,
        pageRendering = {"left": false, "right": false},
        pageNumPending = {"left": null, "right": null},
        scale = 0.9,
        score_canvas = {
            "left": document.getElementById('score_canvas_left'),
            "right": document.getElementById('score_canvas_right')
        },
        score_ctx = {
            "left": score_canvas["left"].getContext('2d'),
            "right": score_canvas["right"].getContext('2d')
        };


    function renderPage(canvas, num) {
        if (!pdfDoc) return;
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

    function recordUserPageSelection(pageNumber) {

        let widget = document.getElementById("audio_player");
        if (widget.paused) {
            // no action
        } else {
            audioPlayerLog("page selection at play head pos " + widget.currentTime);
            console.log(pageNumber);

            // ajaxUploadSheetMusicPageSelection
            var ajaxUrl="${createLink(controller:'recording',action:'ajaxUploadSheetMusicPageSelection')}";

            $.ajax({
                url:ajaxUrl,
                data: {
                    pageNumber: pageNumber,
                    playheadLocation: widget.currentTime,
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
                    $("#discard_tap_list").text("Discard 0 Samples");
                }
            });
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
        recordUserPageSelection(pageNum);
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

        if (pdfDoc != null && pageNum >= pdfDoc.numPages) {
            return;
        }

        pageNum++;
        recordUserPageSelection(pageNum);
        queueRenderPage("left", pageNum);
        if (pdfDoc != null && pageNum < pdfDoc.numPages) {
            queueRenderPage("right", pageNum+1);
        } else {
            console.log("TODO: clear canvas");
        }

    }


    let zoomStep = 0.1;

    function scoreZoomIn() {
        scale += zoomStep;
        queueRenderPage("left", pageNum);
        queueRenderPage("right", pageNum + 1);
    }

    function scoreZoomOut() {
        scale -= zoomStep;
        queueRenderPage("left", pageNum);
        queueRenderPage("right", pageNum + 1);
    }

    $(function() {
        $("#score_zoom_in").on("click", function() {
            scoreZoomIn();
        });
        $("#score_zoom_out").on("click", function() {
            scoreZoomOut();
        });
    });


    pdfjsLib.getDocument("${createLink(controller: 'abstractMusicPart', action: 'getScoreFile', id: recording.abstractMusicPart.id)}").promise.then(function(pdfDoc_) {
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


    function discardTapData() {
        tapList = [];
        $("#save_tap_list").text("Save " + tapList.length + " Samples");
        $("#discard_tap_list").text("Discard " + tapList.length + " Samples");
    }

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
                $("#discard_tap_list").text("Discard 0 Samples");
            }
        });
    }

    function timerToHumanReadable(timer) {
        let minutes = Math.round(timer / 60);
        let r = timer % 60;
        return "mm:ss " + minutes + ":" + r.toFixed(2)
    }

    // getter and setter
    function updateTimer(time) {
        timer = time;
        drawPlayHead(time);
        $("#add_new_annotation").text("Add now: " + timerToHumanReadable(timer));
    }

    function updateTapTempo(time) {
        tapList.push(time);
        drawTapPoint(time);
        $("#tap_list").text(tapList.length);
        $("#save_tap_list").text("Save " + tapList.length + " Samples");
        $("#discard_tap_list").text("Discard " + tapList.length + " Samples");
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
            audioPlayerLog("ontimeupdate");
            var widget = document.getElementById("audio_player");
            if (widget.paused) {
                audioPlayerLog("prepared to play " + widget.currentTime);
            } else {
                //audioPlayerLog("playing " + widget.currentTime);
                updateTimer(widget.currentTime);
                //drawPlayHead(widget.currentTime);
            }
            mapTime(widget.currentTime);
            // clearCanvas(widget.currentTime);

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
        $("#discard_tap_list").on("click", function() {
            discardTapData();
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
        canvas.height = 50;
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
        /*
        if (time > vizStartTime && time < (vizStartTime + vizDuration)) {
            //console.log("unnecessary");
            return;
        }
        */
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        vizStartTime = time;

        var t0 = performance.now();
        drawAnnotations();
        var t1 = performance.now();
        console.log("Call to drawAnnotations took " + (t1 - t0) + " milliseconds.");
    }



    // maps a time event (tap at second 5.67) to x coords in the canvas
    // depending on width and viz duration
    // also moves the whole canvas when we map something outside the current canvas
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

    function mapPixel(x, y) {
        // x means time
        // y means "line" in the canvas

        // get the position and size of the canvas
        var vizPosition = $("#viz").position();
        // console.log("left: " + vizPosition.left);
        // console.log("top: " + vizPosition.top);

        // map x, y
        // remove x-offset from canvas
        x = x - vizPosition.left;
        var pixelPerSec = canvas.width / vizDuration;
        var clickedTime = (x / pixelPerSec) + vizStartTime;


        // switch y to event

        return {"time": clickedTime};

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

    function clearPlayHead() {
        // temporary workaround: redraw the whole thing. TODO: layers for different viz types
        clearCanvas(vizStartTime);
    }



    $(function () {
        /**
         * define event handlers for mouse events
         */
        $("#viz").on("click", function(event) {

            console.log("click");
            console.log(event.pageX);
            console.log(event.pageY);

            var pixelInViz = mapPixel(event.pageX, event.pageY);
            if (typeof pixelInViz["time"] !== "undefined") {
                console.log(pixelInViz["time"]);
            }

        });
        $("#viz").on("dblclick", function(event) {
            /*
            console.log("dblclick");
            console.log(event.pageX);
            console.log(event.pageY);
             */
            var pixelInViz = mapPixel(event.pageX, event.pageY);
            if (typeof pixelInViz["time"] !== "undefined") {
                // redraw viz with old time to get rid of previous progress bar
                clearPlayHead();

                var t = pixelInViz["time"];
                var widget = document.getElementById("audio_player");
                widget.currentTime = t;
                updateTimer(t);
            }
        });

    });


    initCanvas();
    clearCanvas(0.0);


    /** context menu
     *
     */
    $.contextMenu({
        selector: '#viz',

        build: function($trigger, e) {
            // this callback is executed every time the menu is to be shown
            // its results are destroyed every time the menu is hidden
            // e is the original contextmenu event, containing e.pageX and e.pageY (amongst other data)
            // console.log(e.originalEvent.target.parentElement.id );

            return {
                callback: function(key, options) {
                    // console.log(e);
                    // get x and y clicked in canvas
                    var x = e.originalEvent.x;
                    var y = e.originalEvent.y;

                    var clickTarget = mapPixel(x, y);

                    var m = "clicked: " + key;
                    console.log(m);
                    console.log(clickTarget);

                    var parts = key.split("-");
                    var command = parts[0];
                    switch (command) {
                        case "addToTrackList":
                            // addTrackToTrackList(sourceTrackId, parts[1]);
                            break;
                        case "addNewTrackList":
                            // addTrackToNewTrackList(sourceTrackId);
                            break;
                        default:
                            console.log("click command not implemented");
                    }

                },
                items: {
                    "show": {name: "show", icon: "fa-external-link"},
                    
                }
            };
        }
    });


</script>





