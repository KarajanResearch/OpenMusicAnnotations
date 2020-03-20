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


    constructor(recording, annotationSessions, peaks) {
        /**
         * hold gorm-result from recording/show. TODO: check, why ${} doesn't work
         * Ajax-callbacks update local data structure as well
         */
        this.recording = recording; // form recordingId
        this.annotationSessions = annotationSessions;



        // gethered statistics
        this.beatDescription = {};

        // this.waveFormUrl = $("#waveFormUrl").val();
        // this.imageSampleUrl = $("#imageSampleUrl").val();

        this.beatDescriptionUrl = $("#beatDescriptionUrl").val();

        this.vizStartTime = 0.0; // offset. beginning of viz
        this.currentTime = 0.0;
        this.vizDuration = 10.0; // length of viz in seconds


        /**
         * ui elements
         */
        this.sessionList = document.getElementById("sessionList");


        /**
         * peaks.js canvas container to add annotations
         */
        this.peaks = peaks;

        /**
         * Application default Zoom Level
         */
        this.peaks.zoom.setZoom(4);


        /**
         * interaction between audio element and rendering engine
         */
        this.renderingDelay = 20; // ms
        this.audioPlayer = document.getElementById("audio_player");



        // todo: refactor
        this.drawAnnotations(this.annotationSessions["averageBeats"]);


        $((function() {
            $("#peaksZoomIn").on("click", (function() {
                this.zoomIn();
            }).bind(this));
            $("#peaksZoomOut").on("click", (function() {
                this.zoomOut();
            }).bind(this));

        }).bind(this));
        // https://stackoverflow.com/questions/20279484/how-to-access-the-correct-this-inside-a-callback

    }


    /**
     * https://github.com/bbc/peaks.js#zoom-api
     */
    zoomIn() {
        this.peaks.zoom.zoomIn();
    }
    zoomOut() {
        this.peaks.zoom.zoomOut();
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
        // this.updateWaveBackground();
        // this.drawTimeMarkers();
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

        // this.updateBeatDescription();
    }





    annotationCueEvent(annotation) {

    }


    drawSessions() {
        // TODO: filter active sessions

        for(let i = 0; i < this.annotationSessions.length; i++) {



            this.drawAnnotations(this.annotationSessions[i]);
        }
    }

    drawAnnotation(annotation) {

        /*
        Object { id: 29430, intValue: null, session: {…}, doubleValue: null, type: "Tap", subdivision: null, momentOfPerception: 1412.697120181, barNumber: 220, beatNumber: 4 }
         */

        this.peaks.points.add(
            {
                time: annotation.momentOfPerception,
                editable: true,
                // color: '#AAAAAA',
                id: annotation.id,
                labelText: "" + annotation.barNumber + ":" + annotation.beatNumber
            }
        );

    }

    drawAnnotations(session) {

        // TODO: better time filtering
        for (let i = 0; i < session.annotations.length; i++) {
            let annotation = session.annotations[i];

            this.drawAnnotation(annotation);

            /*
            if (annotation.momentOfPerception >= this.vizStartTime && annotation.momentOfPerception <=(this.vizStartTime + this.vizDuration)) {
                this.drawEvent(context, annotation);
            }
            */
        }


    }


}


/**
 * Data Model of Recording and all UI related Data
 */
class RecordingViz {

    constructor(recording) {
        this.recording = recording;
    }


    /**
     * renders annotations after peaks.js has initialized
     * @param annotationSessions json encoded annotations
     * @param peaks instance of peaks.js
     * @returns {AnnotationIconView}
     */
    openAnnotationIconView(annotationSessions, peaks) {
        this.annotationIconView = new AnnotationIconView(this.recording, annotationSessions, peaks);
        return this.annotationIconView;
    }

    openSheetMusic(abstractMusicPartId) {
        this.sheetMusic = new SheetMusic(abstractMusicPartId);
        return this.sheetMusic;
    }


}