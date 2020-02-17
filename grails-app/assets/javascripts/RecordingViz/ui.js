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

/**
 * a timeline-kind-of visualization of annotations
 */
class AnnotationIconView {

    constructor(recording, annotationSessions, waveFormUrl, imageSampleUrl) {
        /**
         * hold gorm-result from recording/show.
         * Ajax-callbacks update local data structure as well
         */
        this.recording = recording; // form recordingId
        this.annotationSessions = annotationSessions;
        this.waveFormUrl = waveFormUrl;
        this.imageSampleUrl = imageSampleUrl;

        /** ui elements
         */
        this.canvas = document.getElementById("annotationIconView");
        this.sessionList = document.getElementById("sessionList");
        this.vizStartTime = 0.0; // offset. beginning of viz
        this.vizDuration = 30.0; // length of viz in seconds
        this.canvas.width = window.innerWidth; // todo: react to changing window size
        this.canvas.height = 50;
        console.log(this.canvas.width);
        this.ctx = this.canvas.getContext("2d");

        // testing draw first session
        this.drawSession(this.annotationSessions[0]);

        this.updateSessionList();

        this.updateWaveBackground();
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


        $.ajax({
            url:this.waveFormUrl,
            data: {
                recording: this.recording,
                from_sample: this.vizStartTime * sampleRate,
                to_sample: (this.vizStartTime + this.vizDuration) * sampleRate
            },
            success: function(resp){
                //console.log(resp);
                if (resp["Error"]) {
                    console.log(resp["Error"]);
                    return;
                }

                for (let i = 0; i < resp.length; i++) {
                    console.log(resp[i]);
                    $("#waveForm").append("<img id='img' src='.png'/>");

                }


            },
            error: function (resp) {
                console.log(resp);
                if (resp["Error"]) {
                    console.log(resp["Error"]);
                    return;
                }
            }
        });


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
        this.recording = recording
    }


    openAnnotationIconView(annotationSessions, waveFormUrl, imageSampleUrl) {
        this.annotationIconView = new AnnotationIconView(this.recording, annotationSessions, waveFormUrl, imageSampleUrl);
        return this.annotationIconView;
    }

    openSheetMusic(pdfUrl) {
        this.sheetMusic = new SheetMusic(pdfUrl);
        return this.sheetMusic;
    }


}