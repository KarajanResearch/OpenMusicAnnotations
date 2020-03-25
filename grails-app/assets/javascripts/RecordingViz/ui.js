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


    constructor(recording, peaks) {
        /**
         * hold gorm-result from recording/show. TODO: check, why ${} doesn't work
         * Ajax-callbacks update local data structure as well
         */
        this.recording = recording; // form recordingId



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


        /**
         * annotation session stuff
         */
        this.drawAnnotations();


        /**
         * event handlers of ui elements
         */
        $((function() {
            $("#peaksZoomIn").on("click", (function() {
                this.zoomIn();
            }).bind(this));
            $("#peaksZoomOut").on("click", (function() {
                this.zoomOut();
            }).bind(this));
            $("#tapTempo").on("click", (function() {
                this.tapTempo();
            }).bind(this));

            $("#sessionList").on("change", (function(e) {
                console.log("sessionList clicked");
                this.sessionSelected( $("#sessionList").val() );
            }).bind(this));


        }).bind(this));
        // https://stackoverflow.com/questions/20279484/how-to-access-the-correct-this-inside-a-callback



        // override space bar behaviour. play/pause
        $(window).keypress((function(e) {

            // record timestamp before doing any processing
            const momentOfPerception = this.peaks.player.getCurrentTime();

            if (e.which === 32) {
                // no scrolling
                e.preventDefault();

                if (this.audioPlayer.paused) {
                    this.peaks.player.play();
                } else {
                    this.peaks.player.pause();
                }
            }



            // pressing numbers to tap beats
            if (e.which === 49 || e.which === 97) {
                // "1" || numpad 1
                this.beatTyped(1, momentOfPerception);
            }
            if (e.which === 50 || e.which === 98) {
                // "2" || numpad 2
                this.beatTyped(2, momentOfPerception);
            }
            if (e.which === 51 || e.which === 99) {
                // "3" || numpad 3
                this.beatTyped(3, momentOfPerception);
            }
            if (e.which === 52 || e.which === 100) {
                // "4" || numpad 4
                this.beatTyped(4, momentOfPerception);
            }
            if (e.which === 53 || e.which === 101) {
                // "5" || numpad 5
                this.beatTyped(5, momentOfPerception);
            }
            if (e.which === 54 || e.which === 102) {
                // "6" || numpad 6
                this.beatTyped(6, momentOfPerception);
            }
            if (e.which === 55 || e.which === 103) {
                // "7" || numpad 7
                this.beatTyped(7, momentOfPerception);
            }
            if (e.which === 56 || e.which === 104) {
                // "8" || numpad 8
                this.beatTyped(8, momentOfPerception);
            }
            if (e.which === 57 || e.which === 105) {
                // "9" || numpad 9
                this.beatTyped(9, momentOfPerception);
            }


        }).bind(this));




        // Points mouse events
        this.peaks.on('points.dblclick', (function(point) {
            /**
             * double clicking a point removes point
             */
            this.peaks.points.removeById(point.id);
        }).bind(this));
/*
        this.peaks.on('points.mouseenter', function(point) {
            console.log('points.mouseenter:', point);
        });

        this.peaks.on('points.mouseleave', function(point) {
            console.log('points.mouseleave:', point);
        });

        this.peaks.on('points.dblclick', function(point) {
            console.log('points.dblclick:', point);
        });

        this.peaks.on('points.dragstart', function(point) {
            console.log('points.dragstart:', point);
        });

        this.peaks.on('points.dragmove', function(point) {
            console.log('points.dragmove:', point);
        });

        this.peaks.on('points.dragend', function(point) {
            console.log('points.dragend:', point);
        });

        // Segments mouse events

        this.peaks.on('segments.dragstart', function(segment, startMarker) {
            console.log('segments.dragstart:', segment, startMarker);
        });

        this.peaks.on('segments.dragend', function(segment, startMarker) {
            console.log('segments.dragend:', segment, startMarker);
        });

        this.peaks.on('segments.dragged', function(segment, startMarker) {
            console.log('segments.dragged:', segment, startMarker);
        });

        this.peaks.on('segments.mouseenter', function(segment) {
            console.log('segments.mouseenter:', segment);
        });

        this.peaks.on('segments.mouseleave', function(segment) {
            console.log('segments.mouseleave:', segment);
        });

        this.peaks.on('segments.click', function(segment) {
            console.log('segments.click:', segment);
        });

        this.peaks.on('zoomview.dblclick', function(time) {
            console.log('zoomview.dblclick:', time);
        });

        this.peaks.on('overview.dblclick', function(time) {
            console.log('overview.dblclick:', time);
        });
*/


        // event, when a point is hit
        this.peaks.on("points.enter", (function (point) {
            this.playClick();
        }).bind(this));

        this.clickPlayer = document.getElementById("click_sound");



    }

    tapTempo() {
        // record timestamp before doing any processing
        const momentOfPerception = this.peaks.player.getCurrentTime();
        this.playClick();
        let p = this.peaks.points.add({
            time: momentOfPerception,
            labelText:"T",
            editable: true
        });
        console.log(p);
    }


    playClick() {
        this.clickPlayer.pause();
        this.clickPlayer.currentTime = 0;
        this.clickPlayer.play();
    }


    /**
     * captured number keys to add numbered beats
     */
    beatTyped(beatNumber, momentOfPerception) {


        // console.log("Beat " + beatNumber + " at " + momentOfPerception);
        this.playClick();

        this.peaks.points.add({
            time: momentOfPerception,
            labelText: beatNumber.toString(),
            editable: true
        })


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







    annotationCueEvent(annotation) {

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


    sessionSelected(sessionId) {
        console.log(sessionId);

        console.log(new Date().toUTCString());

        if (sessionId === null) return;

        // load annotations of session
        // load session list
        let ajaxUrl = $("#sessionUrl").val();
        $.ajax({
            url:ajaxUrl,
            data: {
                session: sessionId
            },
            success: (function(resp){

                if (resp["error"]) {
                    console.log(resp["error"]);
                    return;
                }



                console.log("session response");
                console.log(new Date().toUTCString());



                // remove old points
                this.peaks.points.removeAll();
                console.log("point removal done");
                console.log(new Date().toUTCString());


                if (typeof resp["annotations"] === "undefined") {
                    console.log("no annotations");
                    return;
                }

                // add new points
                for (let i = 0; i < resp.annotations.length; i++) {
                    let annotation = resp.annotations[i];

                    // console.log(annotation.id);
                    this.drawAnnotation(annotation);

                    /*
                    let annotations = session.annotations;
                    for (let j = 0; j < annotations.length; j++) {
                        this.drawAnnotation(annotations[j]);
                    }

                     */

                }
                console.log("drawing done");
                console.log(new Date().toUTCString());


            }).bind(this)
        });



    }

    drawAnnotations() {


        // load session list
        let ajaxUrl = $("#sessionListUrl").val();
        $.ajax({
            url:ajaxUrl,
            data: {
                recording: this.recording
            },
            success: (function(resp){

                // delete session List content
                $("#sessionList option").each(function () {
                    $(this).remove();
                });

                $("#sessionList").append(new Option("Select Session...", "-1"));


                for (let i = 0; i < resp.length; i++) {
                    let session = resp[i];

                    console.log(session.id);
                    console.log(session.title);
                    // add to session List
                    $("#sessionList").append(new Option(session.title, session.id));

                    /*
                    let annotations = session.annotations;
                    for (let j = 0; j < annotations.length; j++) {
                        this.drawAnnotation(annotations[j]);
                    }

                     */

                }

                $("#sessionList").append(new Option("New Session", null));



                if (resp["error"]) {
                    console.log(resp["error"]);
                    return;
                }
            }).bind(this)
        });





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
     * @param peaks instance of peaks.js
     * @returns {AnnotationIconView}
     */
    openAnnotationIconView(peaks) {
        this.annotationIconView = new AnnotationIconView(this.recording, peaks);
        return this.annotationIconView;
    }

    openSheetMusic(abstractMusicPartId) {
        this.sheetMusic = new SheetMusic(abstractMusicPartId);
        return this.sheetMusic;
    }


}