class SheetMusic {

    constructor(abstractMusicPartId) {

        this.pdfUrl = $("#scoreUrl").val() + "/" + abstractMusicPartId;

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




        this.pdfjsLib.getDocument(this.pdfUrl).promise.then((function(pdfDoc_) {
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
            // console.log("rendering; " + num + " to the " + canvas);
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


/**
 * a timeline-kind-of visualization of annotations
 */
class AnnotationIconView {


    constructor(recording, annotationSessions) {
        /**
         * hold gorm-result from recording/show. TODO: check, why ${} doesn't work
         * Ajax-callbacks update local data structure as well
         */
        this.recording = recording; // form recordingId
        this.annotationSessions = annotationSessions;

        // gethered statistics
        this.beatDescription = {};

        this.waveFormUrl = $("#waveFormUrl").val();
        this.imageSampleUrl = $("#imageSampleUrl").val();
        this.beatDescriptionUrl = $("#beatDescriptionUrl").val();

        this.vizStartTime = 0.0; // offset. beginning of viz
        this.currentTime = 0.0;
        this.vizDuration = 10.0; // length of viz in seconds


        /**
         * ui elements
         */
        this.sessionList = document.getElementById("sessionList");



        /**
         * concrete UI timeline rendering
         */
        this.timelineViewport = new Concrete.Viewport({
            container: document.getElementById('timelineViewport'),
            width: window.innerWidth, // todo: react to changing window size
            height: 400
        });
        this.playHeadLayer = new Concrete.Layer();
        this.beatDescriptionLayer = new Concrete.Layer();
        this.annotationLayers = {}; // new Concrete.Layer();
        this.timelineViewport.add(this.playHeadLayer);
        this.timelineViewport.add(this.beatDescriptionLayer);


        // testing draw first session
        //this.drawSession(this.annotationSessions[0]);

        this.updateSessionList();

        this.updateWaveBackground();


        this.drawSessions();


        /**
         * interaction between audio element and rendering engine
         */
        this.renderingDelay = 20; // ms
        this.audioPlayer = document.getElementById("audio_player");


        /**
         * set regular updates of renderer on time intervals and audio widget time updates
         */
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
        // https://stackoverflow.com/questions/20279484/how-to-access-the-correct-this-inside-a-callback

        $('#audio_player').on('timeupdate', (function () {
            // audioPlayerLog("ontimeupdate");
            this.updatePlayHead(this.audioPlayer.currentTime);
        }).bind(this));


    }



    updatePlayHead(currentTime) {
        //console.log("playing " + currentTime);
        this.currentTime = currentTime;
        this.drawPlayHead();
    }


    drawPlayHead() {
        let pointRadius = 2;
        let x = this.mapTime(this.currentTime);
        let y = 0; //;this.canvas.height - 4;

        //this.playHeadLayer.visible = true;

        this.playHeadLayer.scene.clear();

        let context = this.playHeadLayer.scene.context;

        context.beginPath();
        context.arc(x, y, pointRadius, 0, 2 * Math.PI);
        context.stroke();

        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x, y + this.playHeadLayer.height);
        context.stroke();

        this.timelineViewport.render();
    }


    // maps a time event (tap at second 5.67) to x coords in the canvas
    // depending on width and viz duration
    // also moves the whole canvas when we map something outside the current canvas
    mapTime(time) {

        if (time > this.vizStartTime + this.vizDuration) {
            // redraw canvas and update startTime
            this.moveTimeline(time);
        }
        if (time < this.vizStartTime) {
            // redraw canvas and update startTime
            this.moveTimeline(time);
        }

        let pixPerSec = this.timelineViewport.width / this.vizDuration;
        return (time - this.vizStartTime) * pixPerSec;
    }

    moveTimeline(time) {
        this.vizStartTime = time;
        this.updateWaveBackground();
        this.drawSessions();
        this.drawBeatDescription();
    }


    /**
     * creates session selection UI based on this.annotationSessions
     */
    updateSessionList() {

        $("#sessionList").empty();
        for(let i = 0; i < this.annotationSessions.length; i++) {
            let title = this.annotationSessions[i].title.replace("Upload of ", "");
            $("#sessionList").append('<li><button class="buttons vizPlay">' + title + '</button></li>');
        }
        //TODO: add actions to buttons

        this.updateBeatDescription();
    }



    drawBeatDescription() {

        console.log("drawBeatDescription");

        let pointRadius = 8;

        let y = this.timelineViewport.height / 2;
        this.beatDescriptionLayer.scene.clear();

        let context = this.beatDescriptionLayer.scene.context;


        for (let bar in this.beatDescription) {
            for (let beat in this.beatDescription[bar]) {
                let sample = this.beatDescription[bar][beat];
                if (sample["avg"] >= this.vizStartTime && sample["avg"] <= (this.vizStartTime + this.vizDuration) ) {
                    console.log(bar);
                    console.log(beat);
                    console.log(sample);

                    let r = pointRadius; // * sample["std"];
                    let x = this.mapTime(sample["avg"]);
                    context.beginPath();
                    context.arc(x, y, r, 0, 2 * Math.PI);
                    context.stroke();


                }
            }
        }

        this.timelineViewport.render();


        /*

        let pointRadius = 4;
        let x = this.mapTime(time);
        let y = this.timelineViewport.height / 2;





        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x, y + this.beatDescriptionLayer.height);
        context.stroke();


*/



    }



    updateBeatDescription() {

        console.log("updateBeatDescription");

        $.ajax({
            url:this.beatDescriptionUrl,
            data: {
                recording: this.recording
            },
            success: (function(resp){
                console.log("got beat description");

                // console.log(resp);

                if (resp["Error"]) {
                    console.log(resp["Error"]);
                    return;
                }

                this.beatDescription = resp;
                this.drawBeatDescription();



            }).bind(this),
            error: function (resp) {
                console.log(resp);
                if (resp["Error"]) {
                    console.log(resp["Error"]);
                    return;
                }
            }
        });

    }



    updateWaveBackground() {

        // ajaxUploadSheetMusicPageSelection
        let sampleRate=44100;

        let numberOfImages = this.vizDuration;
        let containerWidth = this.timelineViewport.width;
        //let containerWidth = $("#timelineContainer").css("width").replace("px", "");

        let imageWidth = Math.floor(containerWidth / numberOfImages);

        // resize to avoid rounding errors
        // console.log(imageWidth);
        containerWidth = (imageWidth * numberOfImages);
        this.timelineViewport.width = containerWidth;
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
                // console.log("got image list");
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
        // draw from local image buffer?
    }



    drawEvent(context, type, time) {
        let pointRadius = 4;
        let x = this.mapTime(time);
        let y = this.timelineViewport.height / 2;
        context.beginPath();
        context.arc(x, y, pointRadius, 0, 2 * Math.PI);
        context.stroke();
    }


    drawSessions() {
        // TODO: filter active sessions
        for(let i = 0; i < this.annotationSessions.length; i++) {
            this.drawAnnotations(this.annotationSessions[i]);
        }
    }

    drawAnnotations(session) {

        if (typeof(this.annotationLayers[session.id]) === "undefined") {
            this.annotationLayers[session.id] = new Concrete.Layer();
            this.timelineViewport.add(this.annotationLayers[session.id]);
        }

        this.annotationLayers[session.id].scene.clear();
        let context = this.annotationLayers[session.id].scene.context;

        // TODO: better time filtering
        for (let i = 0; i < session.annotations.length; i++) {
            let annotation = session.annotations[i];
            if (annotation.momentOfPerception >= this.vizStartTime && annotation.momentOfPerception <=(this.vizStartTime + this.vizDuration)) {
                this.drawEvent(context, annotation.type, annotation.momentOfPerception);
            }
        }

        this.timelineViewport.render();


    }


}


/**
 * Data Model of Recording and all UI related Data
 */
class RecordingViz {

    constructor(recording) {
        this.recording = recording;
    }


    openAnnotationIconView(annotationSessions) {
        this.annotationIconView = new AnnotationIconView(this.recording, annotationSessions);
        return this.annotationIconView;
    }

    openSheetMusic(abstractMusicPartId) {
        this.sheetMusic = new SheetMusic(abstractMusicPartId);
        return this.sheetMusic;
    }


}