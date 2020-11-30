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
        currentlyNewSession.push(annotation);
        // https://svelte.dev/tutorial/updating-arrays-and-objects
        currentlyNewSession = currentlyNewSession;

        appContainer.trigger("drawAnnotation", annotation);

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
        let previousSessionSelection = sessionSelection;
        // TODO: merge new selection with previous selection
        // only update selection, when the selection changes. Not the label text!
        let currentSelection = sessionList.filter(s => s.selected);
        if (currentSelection.length != sessionSelection.length) {
            sessionSelection = currentSelection;
        }
    }

    $: {
        sessionSelection;

        appContainer.trigger("clearAllAnnotations");

        for (let i = 0; i < sessionSelection.length; i++) {
            let session = sessionSelection[i].session;
            let color = sessionSelection[i].color;
            // draw that session
            for (let j = 0; j < session.annotations.length; j++) {
                let annotation = session.annotations[j];
                let point = {
                    id: annotation.id,
                    time: annotation.momentOfPerception,
                    editable: session.isMine,
                    labelText: "" + annotation.bar + ":" + annotation.beat,
                    color: color
                }
                appContainer.trigger("drawAnnotation", point);
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
            console.log('Success:', data);

            fetchSessionList();

        })
        .catch((error) => {
            console.error('Error:', error);
        });

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


<h3>Annotations</h3>
{#if sessionList.length == 0}
    No Annotations yet
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
    Tap to add a new Annotations
{/if}
{#if currentlyNewSession.length > 0}
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

    }}>Discard</button>

{/if}

