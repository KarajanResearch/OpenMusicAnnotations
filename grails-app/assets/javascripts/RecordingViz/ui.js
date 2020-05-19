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
        this.metronomeEnabled = true;

        // indicates, if we need the keyboard for text input
        // false means, we use the keyboard to control vixPlayer
        this.focusOnText = false;


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
        this.audioPlayer = document.getElementById("audio_player");

        // TODO: make sure we load the whole file!!!
        this.audioPlayer.oncanplay = (function(){
            this.contextHelp("Loading Audio...");
            console.log("hello canplay");
            console.log("duration:" + this.audioPlayer.duration);
            //this.audioPlayer.currentTime = this.audioPlayer.duration;

        }).bind(this);
        this.audioPlayer.load();

        this.audioPlayer.onsuspend = (function(){
            console.log("onsuspend");

            console.log("duration:" + this.audioPlayer.duration);
            this.audioPlayer.currentTime = this.audioPlayer.duration;

        }).bind(this);


        /**
         * annotation session stuff
         */
        this.session = null;
        this.updateSessionSelect(null);


        /**
         * event handlers of ui elements
         */
        $((function() {
            $("#reload").on("click", (function() {
                console.log("reload");
                location.reload();
            }).bind(this));

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
                this.sessionSelected( $("#sessionList").val() );
            }).bind(this));

            $("#clearSession").on("click", (function() {
                this.clearSession();
            }).bind(this));

            $("#saveSession").on("click", (function() {
                this.saveSession();
            }).bind(this));


            $("#metronomeButton").on("click", (function() {
                this.toggleMetronome();
            }).bind(this));

            // do this for all text inputs to indicate that you need the space bar
            $("#annotationText").on("focus", (function () {
                this.focusOnText = true;
                // console.log("focus on text");
            }).bind(this));
            $("#annotationText").on("focusout", (function () {
                this.focusOnText = false;
                // console.log("focus away from text");
            }).bind(this));


            $("#addAnnotationsText").on("click", (function() {

                console.log("adding text annotations");
                const momentOfPerception = this.peaks.player.getCurrentTime();

                let textValue = $("#annotationText").val();

                if (textValue === "") {
                    console.log("empty");
                    this.contextHelp("Enter Text Annotation first");
                    return;
                }
                if ($("#sessionList").val() === "-1") {
                    console.log("no active session");
                    this.contextHelp("Select a Session to add Annotations");
                    return;
                }
                console.log(textValue);
                this.peaks.points.add({
                    time: momentOfPerception,
                    labelText: $.trim(textValue),
                    editable: true
                });

            }).bind(this));

            $("#deleteSession").on("click", (function() {

                console.log("delete session");
                this.deleteCurrentSession();


            }).bind(this));




        }).bind(this));
        // https://stackoverflow.com/questions/20279484/how-to-access-the-correct-this-inside-a-callback



        // override space bar behaviour. play/pause
        $(window).keypress((function(e) {

            // record timestamp before doing any processing
            const momentOfPerception = this.peaks.player.getCurrentTime();

            // if the focus is on text inputs, we do not use the keyboard for commands
            if (this.focusOnText === true) return;

            if (e.which === 32) {
                // no scrolling
                e.preventDefault();

                if (this.audioPlayer.paused) {
                    this.peaks.player.play();
                } else {
                    this.peaks.player.pause();
                }
            }

            // key pressed
            // console.log(e.which);

            // pressing numbers to tap beats
            if (e.which === 49) {
                // "1" || numpad 1
                this.beatTyped(1, momentOfPerception);
            }
            if (e.which === 50) {
                // "2" || numpad 2
                this.beatTyped(2, momentOfPerception);
            }
            if (e.which === 51) {
                // "3" || numpad 3
                this.beatTyped(3, momentOfPerception);
            }
            if (e.which === 52) {
                // "4" || numpad 4
                this.beatTyped(4, momentOfPerception);
            }
            if (e.which === 53) {
                // "5" || numpad 5
                this.beatTyped(5, momentOfPerception);
            }
            if (e.which === 54) {
                // "6" || numpad 6
                this.beatTyped(6, momentOfPerception);
            }
            if (e.which === 55) {
                // "7" || numpad 7
                this.beatTyped(7, momentOfPerception);
            }
            if (e.which === 56) {
                // "8" || numpad 8
                this.beatTyped(8, momentOfPerception);
            }
            if (e.which === 57) {
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

            if (typeof point.id === "number") {
                let ajaxUrl = $("#annotationDeleteUrl").val();
                $.ajax({
                    url:ajaxUrl,
                    data: {
                        annotation: point.id
                    },
                    success: (function(resp){

                        if (resp["error"]) {
                            console.log(resp["error"]);
                            return;
                        }

                        console.log(resp);



                    }).bind(this)
                });



            }


        }).bind(this));

        this.peaks.on('points.mouseenter', (function(point) {
            // TODO: console.log('points.mouseenter:', point);
        }).bind(this));

        this.peaks.on('points.dragend', (function(point) {
            // TODO: console.log('points.mouseleave:', point);
            this.updateAnnotationMoment(point);
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


    /**
     * displays a temporary context help message
     * @param message
     */
    contextHelp(message) {
        $("#contextHelp").html(message);

        window.setTimeout(function () {
            $("#contextHelp").html("");
        }, 3000);

    }


    toggleMetronome() {
        if (this.metronomeEnabled === true) {
            $("#metronomeButton").html("<strike>Metronome</strike>");
            this.metronomeEnabled = false;
        } else {
            $("#metronomeButton").html("Metronome");
            this.metronomeEnabled = true;
        }
    }


    tapTempo() {
        // record timestamp before doing any processing
        const momentOfPerception = this.peaks.player.getCurrentTime();
        this.playClick();

        if ($("#sessionList").val() === "-1") {
            console.log("no active session");
            this.contextHelp("Select a Session to add Annotations");
            return;
        }

        this.peaks.points.add({
            time: momentOfPerception,
            labelText:"T",
            editable: true
        });
    }


    playClick() {
        if (this.metronomeEnabled === false) return;
        this.clickPlayer.pause();
        this.clickPlayer.currentTime = 0;
        this.clickPlayer.play();
    }


    /**
     * captured number keys to add numbered beats
     */
    beatTyped(beatNumber, momentOfPerception) {

        this.playClick();

        if ($("#sessionList").val() === "-1") {
            console.log("no active session");
            this.contextHelp("Select a Session to add Annotations");
            return;
        }

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




    deleteCurrentSession() {
        if (this.session === null) {
            console.log("no session to delete ");
            return;
        }

        let ajaxUrl = $("#sessionDeleteUrl").val();
        $.ajax({
            url:ajaxUrl,
            data: {
                session: this.session.id
            },
            success: (function(resp){

                if (resp["error"]) {
                    console.log(resp["error"]);
                    return;
                }

                console.log("session delete response");
                console.log(resp);

                this.peaks.points.removeAll();

                this.updateSessionSelect(null);


            }).bind(this)
        });


    }

    /**
     * clears the modifications on the currently selected session
     */
    clearSession() {

        // remove old points
        //
        //

        // remove points that were added to the session since last save

        let points = this.peaks.points.getPoints();

        do {

            for (let i = 0; i < points.length; i++) {
                // ATTENTION: we are breaking an abstraction of peaks.js here!
                // Point ids assigned by peaks.js always start with "peaks.point".
                // Point ids from annotations are ALWAYS just numbers, i.e., annotation.id
                if (isNaN(points[i]._id) && points[i]._id.startsWith("peaks.point")) {
                    console.log("removing point: " + points[i]._id);
                    this.peaks.points.removeById(points[i]._id);
                }
            }

            // re-check
            points = this.peaks.points.getPoints();

        } while (points.length > this.session.annotations.length)


    }


    updateAnnotationMoment(point) {


        console.log(point);


        let ajaxUrl = $("#annotationMoveUrl").val();
        $.ajax({
            url:ajaxUrl,
            data: {
                annotation: point._id,
                momentOfPerception: point._time
            },
            success: (function(resp){

                if (resp["error"]) {
                    console.log(resp["error"]);
                    return;
                }

                console.log("updateAnnotationMoment response");
                console.log(resp);


            }).bind(this)
        });


    }


    createSession() {
        // new session?
        if ($("#sessionList").val() === "null") {
            console.log("no active session");
            console.log("creating new session");

            let title = prompt("Title of your Session", this.currentDateTime());

            this.session = {
                id: 0,
                title: title,
                annotations: [],
            };

            // add session via AJAX and update sessionList

            let ajaxUrl = $("#sessionCreateUrl").val();
            $.ajax({
                url:ajaxUrl,
                data: {
                    recording: this.recording,
                    sessionTitle: title
                },
                success: (function(resp){

                    if (resp["error"]) {
                        console.log(resp["error"]);
                        return;
                    }

                    console.log("session create response");
                    console.log(resp);

                    let sessionId = resp.id;

                    this.updateSessionSelect(sessionId);


                }).bind(this)
            });

            // sessionTitle

        }

    }


    /**
     * saves modifications on current session
     */
    saveSession() {

        if (this.session === null) {
            console.log("no session to save ");
            return;
        }
        console.log("save session: " + this.session.title);

        let points = this.peaks.points.getPoints();

        let addedPoints = [];

        do {

            for (let i = 0; i < points.length; i++) {
                // ATTENTION: we are breaking an abstraction of peaks.js here!
                // Point ids assigned by peaks.js always start with "peaks.point".
                // Point ids from annotations are ALWAYS just numbers, i.e., annotation.id
                if (isNaN(points[i]._id) && points[i]._id.startsWith("peaks.point")) {
                    console.log("saving point: " + points[i]._id);

                    let searchDone = false;
                    let exists = false;
                    for (let j = this.session.annotations.length - 1; j >= 0 && searchDone === false; j--) {

                        if (this.session.annotations[j]._id === points[i].id) {
                            // exists
                            exists = true;
                            searchDone = true;
                            console.log("existing");
                        }

                        if (typeof this.session.annotations[j]._id === "undefined"
                            && typeof this.session.annotations[j].id === "number") {
                            // we have scrolled before "peaks.point.id" points in object._id
                            // and arrived at oma.annotations with object.id set to a number
                            searchDone = true;
                            console.log("search done at without match");
                            //console.log(this.session.annotations[j]);
                        }

                    }

                    if (exists === false) {
                        console.log("not found: adding");
                        //console.log(points[i]);
                        this.session.annotations.push(points[i]);
                        addedPoints.push(points[i]);
                    }


                    //this.peaks.points.removeById(points[i]._id);
                }
            }

            // re-check
            points = this.peaks.points.getPoints();

        } while (points.length > this.session.annotations.length);

        // ASSERT: this.session.annotations contains all points, including added points


        // else
        // existing session, update

        console.log(addedPoints);
        let ajaxUrl = $("#annotationCreateUrl").val();

        for (let i = 0; i < addedPoints.length; i++) {

            console.log("annotation create");
            console.log(this.session.id);

            $.ajax({
                url:ajaxUrl,
                data: {
                    session: this.session.id,
                    momentOfPerception: addedPoints[i]["_time"],
                    text: addedPoints[i]["_labelText"]
                },
                success: (function(resp){

                    if (resp["error"]) {
                        console.log(resp["error"]);
                        return;
                    }

                    console.log(resp);

                }).bind(this)
            });


        }

        // save via AJAX!

    }


    drawAnnotation(annotation) {

        /*
        Object { id: 29430, intValue: null, session: {…}, doubleValue: null, type: "Tap", subdivision: null, momentOfPerception: 1412.697120181, barNumber: 220, beatNumber: 4 }
         */

        if (isNaN(annotation.momentOfPerception)) {
            console.log("annotation not a number");
            console.log(annotation);
            return;
        }

        // TODO: proper label creation based on type
        let labelText = "";
        if (annotation.barNumber === null) {
            labelText = annotation.stringValue;
        } else {
            labelText = annotation.barNumber + ":" + annotation.beatNumber;
        }

        this.peaks.points.add(
            {
                time: annotation.momentOfPerception,
                editable: true,
                // color: '#AAAAAA',
                id: annotation.id,
                labelText: labelText
            }
        );

    }


    sessionSelected(sessionId) {
        //if (sessionId === "-1") return; // "Select Session"
        if (sessionId === "-1" || sessionId === "null") {
            this.session = null;
        }

        if (sessionId === "null") {
            // give the new session a name
            // console.log("enabling session name Textedit");
            this.createSession();
            return;
        }

        this.contextHelp("Loading Session");

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



                // remove old points
                this.peaks.points.removeAll();


                if (typeof resp["annotations"] === "undefined") {
                    console.log("no annotations");
                    return;
                }

                this.session = resp;

                // add new points
                for (let i = 0; i < resp.annotations.length; i++) {
                    let annotation = resp.annotations[i];

                    // console.log(annotation.id);
                    this.drawAnnotation(annotation);


                }

            }).bind(this)
        });



    }

    /**
     * date formatting helper
     * @param num
     * @param size
     * @returns {string}
     */
    padNumber(num, size) {
        var s = num+"";
        while (s.length < size) s = "0" + s;
        return s;
    }
    currentDateTime() {
        const d = new Date();
        const ye = new Intl.DateTimeFormat('de', { year: 'numeric' }).format(d);
        const mo = new Intl.DateTimeFormat('de', { month: 'numeric' }).format(d);
        const da = new Intl.DateTimeFormat('de', { day: 'numeric' }).format(d);
        const h = new Intl.DateTimeFormat('de', { hour: '2-digit' }).format(d).replace(" Uhr", "");
        const m = new Intl.DateTimeFormat('de', { minute: 'numeric' }).format(d);
        const s = new Intl.DateTimeFormat('de', { second: 'numeric' }).format(d);

        return `${ye}-${this.padNumber(mo, 2)}-${this.padNumber(da, 2)} ${this.padNumber(h, 2)}:${this.padNumber(m, 2)}:${this.padNumber(s, 2)}`;
    }

    updateSessionSelect(preselect) {


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

                    // console.log(session.id);
                    // console.log(session.title);
                    // add to session List
                    let option = new Option(session.title.slice(0, 32), session.id);
                    if (preselect === session.id) {
                        option.selected="selected";
                        this.sessionSelected(session.id);
                    }

                    option.title = session.title + " (" + session.id + ")";
                    $("#sessionList").append(option);


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