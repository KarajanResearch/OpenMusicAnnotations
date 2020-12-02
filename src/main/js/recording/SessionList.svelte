<script>
    import { onMount } from "svelte";

    // id of the grails recording object passed from the outside
    export let recordingId;

    const appContainer = window.$("#RecordingUiContainer-" + recordingId);

    // local data storage
    let sessionList = [];
    let sessionSelection = [];

    // new session, where new annotations are added
    let currentlyNewSession = [];
    let currentlyNewSessionTitle = "";


    let sessionColors = [
        "#8d8b90",
        "#f92d52",
        "#f93b2f",
        "#f99205",
        "#fcc803",
        "#4ed55f",
        "#5ac4f6",
        "#36a6d6",
        "#0376f7",
        "#5752d0"
    ];

    /**
     * maps an integer to a color in sessionColors
     */
    function pickColor(index) {
        // quasi round-robin ;)
        return sessionColors[index % sessionColors.length];
    }


    async function fetchSessionList() {
        const res = await fetch("/recording/ajaxGetSessionList/" + recordingId);
        let response = await res.json();
        let result = []; // session id is the key of the map
        for (let i = 0; i < response.length; i++) {
            let sessionId = response[i].id
            let listEntry = {
                id: sessionId,
                session: response[i],
                color: pickColor(sessionId),
                selected: false,
                dirty: false
            }
            result.push(listEntry);
        }
        sessionList = result;
    }


    function addAnnotation(annotation) {

        // assign new temporary id
        // prefix id to distinguish them from annotation.id DB-index
        let tempId = "currentlyNew:" + (currentlyNewSession.length + 1).toString();

        annotation.id = tempId;

        currentlyNewSession.push(annotation);
        // https://svelte.dev/tutorial/updating-arrays-and-objects
        currentlyNewSession = currentlyNewSession;



        appContainer.trigger("drawAnnotation", annotation);


        // store id along with annotation in currentlyNewSession



    }


    onMount(async () => {
        await fetchSessionList();

        // attach event handler to receive new annotations
        appContainer.on("addAnnotationToNewSession", function (event, annotation) {
            // peaks.points.add(annotation);

            // create new session, if necessary
            addAnnotation(annotation);

        });

    });


    /**
     * monitoring sessionList and sessionSelection and updating points on waveform
     */
    $: {
        sessionList;
        console.log("sessionList got triggered");

        // only update selection, when the selection changes. Not the label text!
        let currentSelection = sessionList.filter(s => s.selected);
        if (currentSelection.length != sessionSelection.length) {
            sessionSelection = currentSelection;
        }
    }

    /**
     * update waveform canvas in case the selection of annotation sessions has changed
     */
    $: {
        sessionSelection;
        // discard any new annotations, when session selection changes
        console.log("sessionSelection got triggered");
        updateWaveFormCanvas();
    }


    /**
     * draws selected sessions to waveform canvas
     */
    function updateWaveFormCanvas() {
        appContainer.trigger("clearAllAnnotations");

        for (let i = 0; i < sessionSelection.length; i++) {
            let session = sessionSelection[i].session;
            let color = sessionSelection[i].color;
            // draw that session
            for (let j = 0; j < session.annotations.length; j++) {
                let annotation = session.annotations[j];
                let point = {
                    id: `${session.id}:${annotation.id}`,
                    time: annotation.momentOfPerception,
                    editable: session.isMine,
                    labelText: "" + annotation.bar + ":" + annotation.beat,
                    color: color
                }
                appContainer.trigger("drawAnnotation", point);
            }
        }

        for (let i = 0; i < currentlyNewSession.length; i++) {
            appContainer.trigger("drawAnnotation", currentlyNewSession[i]);
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
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data.success);

            // fetchSessionList();
            let session = data.session;

            let listEntry = {
                id: session.id,
                session: session,
                color: pickColor(session.id),
                selected: true,
                dirty: false
            };
            sessionList.push(listEntry);
            sessionList = sessionList;
            currentlyNewSession = [];
            currentlyNewSessionTitle = "";

        })
        .catch((error) => {
            console.error('Error:', error);
        });

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
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {

            if (data.error) {
                console.error('Error:', data.error);
                return;
            }

            console.log('Success:', data.session);

            // update session in UI
            session.session = data.session;
            sessionSelection = sessionSelection;
            sessionList = sessionList;
            currentlyNewSession = [];
            currentlyNewSessionTitle = "";
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
</style>


{#each currentlyNewSession as annotation}
    {annotation.id}
    {annotation.time}
    {annotation.labelText}<br/>
{/each}


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
    }}>Add {currentlyNewSession.length} Annotations</button>
        <button class="buttons" on:click={() => {
        currentlyNewSession = [];
        currentlyNewSessionTitle = "";
        updateWaveFormCanvas();
        }}>Discard</button>

    {/if}

    <h3>New Annotations</h3>

    <input
        class="session_list_entry_title"
        placeholder="Add a Name for new Annotations..."
        bind:value={currentlyNewSessionTitle}
        on:focus={ () => appContainer.trigger("focusOnTextInput", true) }
        on:focusout={ () => {
            appContainer.trigger("focusOnTextInput", false);
        }}
    >

    <button class="buttons" on:click={() => {
        if (currentlyNewSessionTitle === "") {
            return alert("Please add a Name for new Annotations");
        }
        saveCurrentlyNewSession();
    }}>Save {currentlyNewSession.length} Annotations</button>

    <button class="buttons" on:click={() => {
        currentlyNewSession = [];
        currentlyNewSessionTitle = "";
        updateWaveFormCanvas();
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

