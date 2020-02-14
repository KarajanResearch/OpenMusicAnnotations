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

    /*
    recordUserPageSelection(pageNumber) {

        let widget = document.getElementById("audio_player");
        if (widget.paused) {
            // no action
        } else {
            console.log("page selection at play head pos " + widget.currentTime);
            console.log(pageNumber);

            // ajaxUploadSheetMusicPageSelection
            let ajaxUrl="${createLink(controller:'recording',action:'ajaxUploadSheetMusicPageSelection')}";

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

     */



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
 * Data Model of Recording and all UI related Data
 */
class RecordingViz {

    constructor() {

    }

    openSheetMusic(pdfUrl) {
        this.sheetMusic = new SheetMusic(pdfUrl);
    }

}