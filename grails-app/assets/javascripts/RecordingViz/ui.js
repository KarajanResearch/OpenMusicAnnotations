class SheetMusic {

    constructor(pdfUrl) {
        this.pdfUrl = pdfUrl;
        this.pdfjsLib = window['pdfjs-dist/build/pdf'];
        this.pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

        this.pdfDoc = null;
        this.pageNum = 1;
        this.pageRendering = {"left": false, "right": false};
        this.pageNumPending = {"left": null, "right": null};
        this.scale = 0.9;
        this.score_canvas = {
            "left": $("#score_canvas_left")[0],
            "right": $("#score_canvas_right")[0]
        };
        this.score_ctx = {
            "left": this.score_canvas["left"].getContext('2d'),
            "right": this.score_canvas["right"].getContext('2d')
        };

        this.zoomStep = 0.1;


        $((function() {
            $("#prev_page").on("click", (function() {
                this.onPrevPage();
            }).bind(this));
            $("#next_page").on("click", (function() {
                this.onNextPage();
            }).bind(this));
            $("#score_zoom_in").on("click", (function() {
                this.scoreZoomIn();
            }).bind(this));
            $("#score_zoom_out").on("click", (function() {
                this.scoreZoomOut();
            }).bind(this));
        }).bind(this));
        // https://stackoverflow.com/questions/20279484/how-to-access-the-correct-this-inside-a-callback




        this.pdfjsLib.getDocument(pdfUrl).promise.then((function(pdfDoc_) {
            this.pdfDoc = pdfDoc_;

            document.getElementById('page_count').textContent = this.pdfDoc.numPages + " pages";

            // Initial/first page rendering
            this.renderPage("left", this.pageNum);
            this.renderPage("right", this.pageNum+1);
        }).bind(this));


    }



    renderPage(canvas, num) {
        if (!this.pdfDoc) return;
        this.pageRendering[canvas] = true;
        // Using promise to fetch the page
        this.pdfDoc.getPage(num).then((function (page) {
            let viewport = page.getViewport({scale: this.scale});
            this.score_canvas[canvas].height = viewport.height;
            this.score_canvas[canvas].width = viewport.width;

            // Render PDF page into canvas context
            let renderContext = {
                canvasContext: this.score_ctx[canvas],
                viewport: viewport
            };
            console.log("rendering; " + num + " to the " + canvas);
            let renderTask = page.render(renderContext);

            // Wait for rendering to finish
            renderTask.promise.then((function () {
                this.pageRendering[canvas] = false;
                if (this.pageNumPending[canvas] !== null) {
                    // New page rendering is pending
                    this.renderPage(canvas, this.pageNumPending);
                    this.pageNumPending[canvas] = null;
                }
            }).bind(this));
        }).bind(this));
    }


    /**
     * If another page rendering in progress, waits until the rendering is
     * finised. Otherwise, executes rendering immediately.
     */
    queueRenderPage(canvas, num) {
        if (this.pageRendering[canvas]) {
            this.pageNumPending[canvas] = num;
        } else {
            this.renderPage(canvas, num);
        }
    }



    /**
     * Displays previous page.
     */

    onPrevPage() {
        if (this.pageNum <= 1) {
            return;
        }
        this.pageNum--;
        //recordUserPageSelection(pageNum);
        this.queueRenderPage("left", this.pageNum);
        this.queueRenderPage("right", this.pageNum + 1);
    }

    /**
     * Displays next page.
     */

    onNextPage() {

        if (this.pdfDoc != null && this.pageNum >= this.pdfDoc.numPages) {
            return;
        }

        this.pageNum++;
        //recordUserPageSelection(pageNum);
        this.queueRenderPage("left", this.pageNum);
        if (this.pdfDoc != null && this.pageNum < this.pdfDoc.numPages) {
            this.queueRenderPage("right", this.pageNum+1);
        } else {
            console.log("TODO: clear canvas");
        }

    }




    scoreZoomIn() {
        this.scale += this.zoomStep;
        this.queueRenderPage("left", this.pageNum);
        this.queueRenderPage("right", this.pageNum + 1);
    }

    scoreZoomOut() {
        this.scale -= this.zoomStep;
        this.queueRenderPage("left", this.pageNum);
        this.queueRenderPage("right", this.pageNum + 1);
    }




}

function getBase64Image(img) {
    let canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    let ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    let dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}



/**
 * a timeline-kind-of visualization of annotations
 */
class AnnotationIconView {


    constructor(recording, annotationSessions) {
        /**
         * hold gorm-result from recording/show.
         * Ajax-callbacks update local data structure as well
         */
        this.recording = recording; // form recordingId
        this.annotationSessions = annotationSessions;
        this.waveFormUrl = $("#waveFormUrl").val();
        this.imageSampleUrl = $("#imageSampleUrl").val();

        /** ui elements
         */
        this.canvas = document.getElementById("annotationIconView");
        this.sessionList = document.getElementById("sessionList");
        this.vizStartTime = 0.0; // offset. beginning of viz
        this.currentTime = 0.0;
        this.microTimer = 0.0;
        this.vizDuration = 10.0; // length of viz in seconds
        this.canvas.width = window.innerWidth; // todo: react to changing window size
        this.canvas.height = 400;
        console.log(this.canvas.width);
        this.ctx = this.canvas.getContext("2d");


        /**
         * different canvases for different "layers"
         */
        this.playHeadCanvas = document.createElement('canvas');
        this.playHeadCanvas.height = this.canvas.height;
        this.playHeadCanvas.width = this.canvas.width;
        this.playHeadCanvasContext = this.playHeadCanvas.getContext("2d");


        // testing draw first session
        this.drawSession(this.annotationSessions[0]);

        this.updateSessionList();

        this.updateWaveBackground();

/*
        $((function() {

            $('#audio_player').on('timeupdate', (function () {


                // audioPlayerLog("ontimeupdate");
                var widget = document.getElementById("audio_player");
                if (widget.paused) {
                    console.log("prepared to play " + widget.currentTime);
                } else {
                    //updateTimer(widget.currentTime);
                    this.updatePlayHead(widget.currentTime);
                    //drawPlayHead(widget.currentTime);
                }
                //mapTime(widget.currentTime);
                // clearCanvas(widget.currentTime);

            }).bind(this));

        }).bind(this));
        // https://stackoverflow.com/questions/20279484/how-to-access-the-correct-this-inside-a-callback
*/

        this.renderingDelay = 20; // ms
        this.audioPlayer = document.getElementById("audio_player");

        setInterval((function () {
            if (this.audioPlayer.paused) {
                // console.log("prepared to play " + widget.currentTime);
            } else {
                //updateTimer(widget.currentTime);
                this.updatePlayHead(this.audioPlayer.currentTime);
                //drawPlayHead(widget.currentTime);
                //console.log("timer: " + widget.currentTime);
            }
        }).bind(this), this.renderingDelay)

    }

    updateMicroTimer(currentTime) {
        // TODO: average timer intervals to control the pace of faster events
    }

    updatePlayHead(currentTime) {
        //console.log("playing " + currentTime);
        this.currentTime = currentTime;
        this.updateMicroTimer(currentTime);
        this.drawPlayHead();
    }


    drawPlayHead() {
        let pointRadius = 2;
        let x = this.mapTime(this.currentTime);
        let y = 4; //;this.canvas.height - 4;

        this.ctx.clearRect(0, 0, this.ctx.width, this.ctx.height);
        this.playHeadCanvasContext.clearRect(0, 0, this.playHeadCanvas.width, this.playHeadCanvas.height);

        this.playHeadCanvasContext.beginPath();
        this.playHeadCanvasContext.arc(x, y, pointRadius, 0, 2 * Math.PI);
        this.playHeadCanvasContext.stroke();
/*
        this.playHeadCanvasContext.beginPath();
        this.playHeadCanvasContext.moveTo(x, y);
        this.playHeadCanvasContext.lineTo(x, y + this.playHeadCanvas.height);
        this.playHeadCanvasContext.stroke();
*/
        // draw playhead layer on canvas
        this.ctx.drawImage(this.playHeadCanvas, 0, 0, this.canvas.width, this.canvas.height);
    }


    // maps a time event (tap at second 5.67) to x coords in the canvas
    // depending on width and viz duration
    // also moves the whole canvas when we map something outside the current canvas
    mapTime(time) {

        if (time > this.vizStartTime + this.vizDuration) {
            // redraw canvas and update startTime
            this.clearCanvas(time);
        }
        if (time < this.vizStartTime) {
            // redraw canvas and update startTime
            this.clearCanvas(time);
        }

        let pixPerSec = this.canvas.width / this.vizDuration;
        return (time - this.vizStartTime) * pixPerSec;
    }

    clearCanvas(time) {
        // necessary?
        /*
        if (time > vizStartTime && time < (vizStartTime + vizDuration)) {
            //console.log("unnecessary");
            return;
        }
        */
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.vizStartTime = time;

        let t0 = performance.now();
        //drawAnnotations();
        let t1 = performance.now();
        console.log("Call to drawAnnotations took " + (t1 - t0) + " milliseconds.");

        let t2 = performance.now();
        this.updateWaveBackground();
        let t3 = performance.now();
        console.log("Call to waveForm took " + (t3 - t2) + " milliseconds.");
    }


    updateSessionList() {

        $("#sessionList").empty();
        for(let i = 0; i < this.annotationSessions.length; i++) {
            let title = this.annotationSessions[i].title.replace("Upload of ", "");
            $("#sessionList").append('<li><button>' + title + '</button></li>');
        }
        //TODO: add actions to buttons
    }




    updateWaveBackground() {

        console.log("updateWaveBackground");


        // ajaxUploadSheetMusicPageSelection
        let sampleRate=44100;

        let numberOfImages = this.vizDuration;
        let containerWidth = $("#timelineContainer").css("width").replace("px", "");

        let imageWidth = Math.floor(containerWidth / numberOfImages);

        // resize to avoid rounding errors
        console.log(imageWidth);
        containerWidth = (imageWidth * numberOfImages);
        $("#timelineContainer").css("width", "" + containerWidth + "px");
        $("#waveForm").css("width", "" + containerWidth + "px");
        $("#waveFormLeft").css("width", "" + containerWidth + "px");
        $("#waveFormRight").css("width", "" + containerWidth + "px");
        $("#annotationIconView").css("width", "" + containerWidth + "px");




        // update local image buffer

        $.ajax({
            url:this.waveFormUrl,
            data: {
                recording: this.recording,
                from_sample: Math.floor(this.vizStartTime) * sampleRate,
                to_sample: Math.floor(this.vizStartTime + this.vizDuration) * sampleRate
            },
            success: (function(resp){
                console.log("got image list");
                if (resp["Error"]) {
                    console.log(resp["Error"]);
                    return;
                }

                $("#waveFormLeft").empty();
                $("#waveFormRight").empty();

                for (let i = 0; i < resp.length; i++) {
                    // console.log(resp[i]);
                    let sampleId = resp[i][0];
                    let sampleType = resp[i][1];

                    let image = document.createElement("img");
                    image.id = "sample-" + sampleId;
                    image.className = "waveFormSample";

                    let imageSrc = localStorage.getItem(image.id);

                    // console.log("local image");
                    // console.log(imageSrc);

                    // TODO: local storage
                    //if (imageSrc == null) {
                        image.src = this.imageSampleUrl + "/" + sampleId;
                        //$(image).ready(function () {

                            // console.log("Image ready: " + image.id);
                            //let i = document.getElementById(image.id);
                            //localStorage.setItem(image.id, getBase64Image(i));


                        //});
                    //} else {
                    //    image.src = "data:image/png;base64," + imageSrc;
                    //    console.log("Hit");
                    //}



                    if (sampleType === "wave-left") {
                        $("#waveFormLeft").append(image);
                    } else if (sampleType === "wave-right") {
                        $("#waveFormRight").append(image);
                    }

                    $("#sample-"+sampleId).css("width", "" + imageWidth + "px");
                }

                // TODO: maybe put images in local storage?


            }).bind(this),
            error: function (resp) {
                // console.log(resp);
                if (resp["Error"]) {
                    console.log(resp["Error"]);
                    return;
                }
            }
        });



        // draw from local image buffer




    }




    drawSession(session) {
        console.log("drawSession");
        console.log(session);
    }


}


/**
 * Data Model of Recording and all UI related Data
 */
class RecordingViz {

    constructor(recording) {
        this.recording = recording;
        console.log(recording);
    }


    openAnnotationIconView(annotationSessions) {
        this.annotationIconView = new AnnotationIconView(this.recording, annotationSessions);
        return this.annotationIconView;
    }

    openSheetMusic(pdfUrl) {
        this.sheetMusic = new SheetMusic(pdfUrl);
        return this.sheetMusic;
    }


}