<script>
    import { onMount } from "svelte";
    import AnnotationEditor from "./AnnotationEditor.svelte";
    import Annotation from "./Annotation.js"

    // id of the grails recording object passed from the outside
    export let recordingId;

    const appContainer = window.$("#RecordingUiContainer-" + recordingId);

    // local data storage
    let sessionList = [];
    let sessionSelection = [];

    // new session, where new annotations are added
    // array of annotations != peaks.point
    let currentlyNewSession = [];
    let currentlyNewSessionTitle = "";

    let sessionColors = [
        "#8d8b90",
        "#5752d0",
        "#f92d52",
        "#0376f7",
        "#f93b2f",
        "#36a6d6",
        "#f99205",
        "#5ac4f6",
        "#fcc803",
        "#4ed55f",
    ];

    let sessionColorsTransparent = [
        "#acabb2",
        "#7872e8",
        "#f95572",
        "#2f92ff",
        "#f96159",
        "#64aed4",
        "#d1a06c",
        "#8dc3ed",
        "#ffeda7",
        "#7fd189",
    ];



    onMount(async () => {
        await fetchSessionList();

        // attach event handler to receive new annotations
        appContainer.on("addAnnotationToNewSession", function (event, annotation) {
            // create new session, if necessary
            addAnnotationToNewSession(annotation);
        });

        // attach event handler to change existing annotations that were e.g. dragged
        appContainer.on("updateAnnotationTime", function (event, point) {
            let annotation = point.annotation;
            annotation.time = point._time;
            annotation.save();
        });

        appContainer.on("deleteAnnotationFromSessionList", function (event, annotation) {
            deleteAnnotationFromLocalState(annotation);
        });

    });


    /**
     * reactive stuff
     */

    /**
     * monitoring sessionList and sessionSelection and updating points on waveform
     */
    $: {
        //console.log("sessionList got triggered");

        // only update selection, when the selection changes. Not the label text!

        let currentSelection = sessionList.filter(s => s.selected);

        let oldSelections = sessionSelection.length;
        let newSelections = currentSelection.length;

        /**
         * check, if the selection has changed to previous state.
         * decide, if selection was added or removed to update canvas
         */
        if (oldSelections === newSelections) {
            // selections have not changed
            // do NOT update sessionSelection
        } else {
            if (oldSelections > newSelections) {
                // selection reduced
                for (let i = 0; i < oldSelections; i++) {
                    let oldSessionId = sessionSelection[i].id;
                    let stillexists = false;
                    for (let j = 0; j < newSelections; j++) {
                        let newSessionId = currentSelection[j].id;
                        if (newSessionId === oldSessionId) {
                            stillexists = true;
                            break;
                        }
                    }
                    if (stillexists === false) {
                        // console.log("removed id: " + oldSessionId);
                        // remove points from canvas
                        clearAnnotationSession(sessionSelection[i]);
                    }
                }
            } else {
                // selection increased
                for (let i = 0; i < newSelections; i++) {
                    let newSessionId = currentSelection[i].id;
                    let isnew = true;
                    for (let j = 0; j < oldSelections; j++) {
                        let oldSessionId = sessionSelection[j].id;
                        if (newSessionId === oldSessionId) {
                            isnew = false;
                            break;
                        }
                    }
                    if (isnew === true) {
                        // console.log("added id: " + newSessionId);
                        // remove points from canvas
                        drawAnnotationSession(currentSelection[i]);
                    }
                }

            }
            // update sessionSelection
            sessionSelection = currentSelection;
        }


        // console.log(sessionSelection);

    }

    /**
     * update waveform canvas in case the selection of annotation sessions has changed
     */
    $: {
        // sessionSelection;
        // discard any new annotations, when session selection changes
        // console.log("sessionSelection got triggered");

        //updateWaveFormCanvas();
    }



    /**
     * @param sessionListEntry object present in sessionSelection
     */
    function clearAnnotationSession(sessionListEntry) {
        console.log(`clearAnnotationSession(${sessionListEntry.id})`);
        let t1 = performance.now();
        sessionListEntry.session.annotations.map(function (annotation) {
            appContainer.trigger("eraseAnnotation", annotation);
        });
        let t2 = performance.now();
        console.log("done in " + (t2 - t1));

        appContainer.trigger("removeTempoCurve", sessionListEntry);
    }

    function drawAnnotationSession(sessionListEntry) {
        console.log(`drawAnnotationSession(${sessionListEntry.id})`);
        let t1 = performance.now();
        //renderSessionAtOnce(session);
        appContainer.trigger("drawSession", sessionListEntry);
        //renderSessionIncrementally(session);
        let t2 = performance.now();
        console.log("done in " + (t2 - t1));

        // TODO: better place to call?
        appContainer.trigger("drawTempoCurve", sessionListEntry);
    }


    /**
     * maps an integer to a color in sessionColors
     */
    function pickColor(index) {
        // quasi round-robin ;)
        return sessionColorsTransparent[index % sessionColorsTransparent.length];
    }


    function createTempoData(sessionListEntry) {

        sessionListEntry.tempoAnnotations = [];
        let previousAnnotation = {};

        for (let j = 0; j < sessionListEntry.session.annotations.length; j++) {
            let annotation = sessionListEntry.session.annotations[j];

            if (j > 0 && annotation.type === "Tap" && (
                annotation.subdivision === null || annotation.subdivision === 1 || annotation.subdivision === 0
            )) {
                let deltaTime = annotation.time - previousAnnotation.time;
                // console.log(deltaTime);
                let tempoAnnotation = new Annotation(
                    {
                        type: "Tempo",
                        time: annotation.time,
                        doubleValue: 60.0 / deltaTime,
                        color: annotation.color
                    }
                );

                sessionListEntry.tempoAnnotations.push(tempoAnnotation);
            }
            previousAnnotation = annotation;
        }


    }


    function convertGormSession(listEntry) {
        // convert annotations to UI representation in Annotation.js
        for (let j = 0; j < listEntry.session.annotations.length; j++) {
            let gormAnnotation = listEntry.session.annotations[j];
            let annotation = Annotation.fromGormAnnotation(gormAnnotation, listEntry.color);
            listEntry.session.annotations[j] = annotation;
        }

        // calculate Tempo Curve
        createTempoData(listEntry);

    }

    async function fetchSessionList() {
        const res = await fetch("/recording/ajaxGetSessionList/" + recordingId);
        let response = await res.json();
        let result = []; // session id is the key of the map
        for (let i = 0; i < response.length; i++) {
            let sessionId = parseInt(response[i].id);
            let listEntry = {
                id: sessionId,
                session: response[i],
                color: pickColor(i),
                selected: false,
                dirty: false, // not used rn
                visible: false // not used rn
            }
            convertGormSession(listEntry);

            result.push(listEntry);
        }
        sessionList = result;
    }

    /**
     * updated the local session list after annotation has been updated at server
     * Note: this one does not trigger a sessionList responsive update
     */
    function updateAnnotationInSessionList(annotation) {

        console.log("updateAnnotationInSessionList");

        for (let i = 0; i < sessionList.length; i++) {
            let listEntry = sessionList[i];

            if (listEntry.session.id === annotation.sessionId) {
                console.log("found session");
                // locate annotation
                for (let j = 0; j < listEntry.session.annotations.length; j++) {

                    if (listEntry.session.annotations[j].annotationId === annotation.annotationId) {
                        listEntry.session.annotations[j] = annotation;
                        return;
                    }
                }
            }
        }
    }


    function addAnnotationToNewSession(annotation) {

        // assign new temporary id
        // prefix id to distinguish them from annotation.id DB-index
        let tempId = "currentlyNew:" + (currentlyNewSession.length).toString();

        annotation.id = tempId;

        currentlyNewSession.push(annotation);
        // https://svelte.dev/tutorial/updating-arrays-and-objects
        currentlyNewSession = currentlyNewSession;

        appContainer.trigger("drawAnnotation", annotation.getPeaksPoint());
    }

    /**
     * changing annotations after dragging, etc.
     * takes a peaks point and converts it to an annotation
     */
    function updateAnnotationInLocalState(annotation) {
        // locate annotation and update

        console.log("updateAnnotationInLocalState");
        console.log(annotation);


        if (annotation.isCurrentlyNew()) {
            // case: new annotation in currentlyNewSession
            let tempIdParts = annotation.id.split(":");
            let annotationId = parseInt(tempIdParts[1]);
            // update currentlyNew data structure
            currentlyNewSession[annotationId] = annotation;

        } else {
            // case: existing annotation in existing session
            updateAnnotationInSessionList(annotation);
        }

    }

    function deleteAnnotationFromLocalState(annotation) {
        console.log("deleteAnnotationFromLocalState");
        console.log(annotation);

        if (annotation.isCurrentlyNew()) {
            currentlyNewSession = currentlyNewSession.filter(function (a) {
                // keep everything, that is not "annotation" to delete
                return a.id !== annotation.id;
            });
        } else {
            // remove from session list
            for (let i = 0; i < sessionList.length; i++) {
                let listEntry = sessionList[i];

                if (listEntry.session.id === annotation.sessionId) {
                    console.log("found session");
                    // keep everything, that is not "annotation" to delete
                    listEntry.session.annotations = listEntry.session.annotations.filter(function (a) {
                        return a.annotationId !== annotation.annotationId;
                    });
                }
            }
        }

    }



    /**
     * persist session title to server
     * @param sessionId
     * @param title
     * @returns {Promise<void>}
     */
    async function sessionTitleUpdate(sessionId, title) {

        let data = {
            sessionId: sessionId,
            title: title
        };

        fetch('/session/ajaxUpdateTitle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            //console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    }

    /**
     * persist new session to server
     * @param sessionId
     * @param title
     * @returns {Promise<void>}
     */
    async function saveCurrentlyNewSession() {


        console.log(currentlyNewSession);


        let data = {
            recordingId: recordingId,
            annotations: currentlyNewSession,
            title: currentlyNewSessionTitle
        };

        fetch('/session/ajaxCreateSession', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            /**
             * use replace funtion to remove cyclic elements
             */
            body: JSON.stringify(data, function (key, val) {
                if (key == "annotation") return;
                if (key == "peaksPoint") return;
                return val;
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data.success);

            // fetchSessionList();
            let session = data.session;

            let listEntry = {
                id: session.id,
                session: session,
                color: pickColor(sessionList.length),
                selected: true,
                dirty: false,
                visible: false
            };

            convertGormSession(listEntry);

            sessionList.push(listEntry);
            sessionList = sessionList;

        })
        .catch((error) => {
            console.error('Error:', error);
        });

    }


    function resetCurrentlyNewSession() {

        console.log("Discard");
        clearAnnotationSession({
            id: 0,
            session: {
                annotations: currentlyNewSession
            }
        });

        currentlyNewSession = [];
        currentlyNewSessionTitle = "";

    }


    /**
     * adds new annotations to existing session. Must be the only selected session
     */
    function addToAnnotationSession() {

        if (sessionSelection.length != 1) {
            console.log("single session must be selected");
            return;
        }

        let session = sessionSelection[0];

        let data = {
            sessionId: session.id,
            annotations: currentlyNewSession
        };


        fetch('/session/ajaxAddToSession', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            /**
             * use replace funtion to remove cyclic elements
             */
            body: JSON.stringify(data, function (key, val) {
                if (key == "annotation") return;
                if (key == "peaksPoint") return;
                return val;
            }),
        })
        .then(response => response.json())
        .then(data => {

            if (data.error) {
                console.error('Error:', data.error);
                return;
            }

            console.log('Success:', data.session);

            // update session in UI
            //session.session = data.session;
            for (let i = 0; i < sessionList.length; i++) {
                let listEntry = sessionList[i];
                // invalidate old entry
                if (listEntry.id === data.session.id) {
                    clearAnnotationSession(listEntry);
                    listEntry.session = data.session;
                    convertGormSession(listEntry);
                    listEntry.selected = true;
                    drawAnnotationSession(listEntry);
                }

            }

            // sessionList = sessionList;
            // sessionSelection = sessionSelection;

        })
        .catch((error) => {
            console.error('Error:', error);
        });

    }


    /**
     * deleting sessions from backend
     */
    function deleteSelectedSessions() {

        let deleteSessionIds = [];
        let newSessionList = [];

        /**
         * remove sessions to delete from UI list
         */
        for (let i = 0; i < sessionList.length; i++) {
            if (sessionList[i].selected === true) {
                deleteSessionIds.push(sessionList[i].session.id);
                // remove from sessionList
            } else {
                // keep not-selected session
                newSessionList.push(sessionList[i]);
            }
        }

        /**
         * delete on server
         */
        let data = {
            deleteSessionIds: deleteSessionIds,
        };

        fetch('/session/ajaxDeleteSessions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });

        // update UI immediately. deleting can run in the background
        sessionList = newSessionList;
    }


</script>


<style>
    #session_list {
        width: 100%;
    }
    .session_list_entry {
        padding: 2px;
    }
    .session_list_entry_title {
        width: 88%;
        opacity: 0.8;
    }
    .session_list_entry_checkbox {
        transform: scale(2);
        width: 10%;
    }
    #annotationEditor {
        width: 100%;
    }
</style>


<div id="annotationEditor">
    <AnnotationEditor recordingId={recordingId} />
</div>


<h3>Annotations</h3>
{#if sessionList.length == 0}
    No Annotations yet.
{/if}

{#if sessionList.length > 0}
    <div id="session_list">
        {#each sessionList as sessionListEntry (sessionListEntry.id)}
            <div class="session_list_entry" style="background-color: {sessionListEntry.color}">
                <input
                    class="session_list_entry_checkbox"
                    type=checkbox
                    bind:checked={sessionListEntry.selected}
                >
                <input
                    class="session_list_entry_title"
                    title="{sessionListEntry.session.title}"
                    placeholder="Name for Annotations..."
                    bind:value={sessionListEntry.session.title}
                    disabled={!sessionListEntry.session.isMine}
                    on:focus={ () => appContainer.trigger("focusOnTextInput", true) }
                    on:focusout={ () => {
                        appContainer.trigger("focusOnTextInput", false);
                        sessionTitleUpdate(sessionListEntry.id, sessionListEntry.session.title);
                    }}
                >
            </div>
        {/each}
    </div>
{/if}

{#if currentlyNewSession.length == 0}
    Tap to add a new Annotations.
{/if}


{#if currentlyNewSession.length > 0}

    {#if (sessionSelection.length == 1) && (sessionSelection[0].session.isMine === true) }

        <h3>Add to "{sessionSelection[0].session.title}"</h3>

        <button class="buttons" on:click={() => {
            addToAnnotationSession();
            resetCurrentlyNewSession();
        }}>Add {currentlyNewSession.length} Annotations</button>

        <button class="buttons" on:click={() => {
            resetCurrentlyNewSession();
        }}>Discard</button>

    {/if}

    <h3>New Annotations</h3>

    <input
        class="session_list_entry_title"
        placeholder="Add a Name for new Annotations..."
        bind:value={currentlyNewSessionTitle}
        on:focus={ () => appContainer.trigger("focusOnTextInput", true) }
        on:focusout={ () => appContainer.trigger("focusOnTextInput", false) }
    >

    <button class="buttons" on:click={() => {
        if (currentlyNewSessionTitle === "") {
            return alert("Please add a Name for new Annotations");
        }
        saveCurrentlyNewSession();
        resetCurrentlyNewSession();
    }}>Save {currentlyNewSession.length} Annotations</button>

    <button class="buttons" on:click={() => {
        resetCurrentlyNewSession();
    }}>Discard</button>

{/if}


{#if sessionSelection.length > 0}
    <h3>Delete Selected Annotations</h3>
    <button class="buttons" on:click={() => {
        if (confirm("Are you sure? Deleting Annotations cannot be undone!")) {
            console.log(sessionSelection);
            deleteSelectedSessions();
        }
    }}>Delete {sessionSelection.length > 1 ? `${sessionSelection.length} Sessions` : 'Session'}  </button>
{/if}

