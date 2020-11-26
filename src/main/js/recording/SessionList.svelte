<script>
    import { onMount } from "svelte";

    // id of the grails recording object passed from the outside
    export let recordingId;

    const appContainer = window.$("#RecordingUiContainer-" + recordingId);

    let sessionSelection = [];
    let sessionList = [];


    onMount(async () => {

        const res = await fetch("/recording/ajaxGetSessionList/" + recordingId);
        sessionList = await res.json();

    });


    /**
     * monitoring sessionSelection and updating points on waveform
     */
    $: {
        sessionSelection;
        appContainer.trigger("clearAllAnnotations");

        for (let i = 0; i < sessionList.length; i++) {
            let session = sessionList[i];
            if (sessionSelection.includes(session.id)) {
                // draw that session
                for (let j = 0; j < session.annotations.length; j++) {
                    let annotation = session.annotations[j];
                    let point = {
                        id: annotation.id,
                        time: annotation.momentOfPerception,
                        editable: session.isMine,
                        labelText: "" + annotation.bar + ":" + annotation.beat
                    }
                    appContainer.trigger("drawAnnotation", point);
                }
            }
        }
    }

    function clearSelection() {
        sessionSelection = [];
    }


</script>

<style>
    #session_list {
        width: 100%;
    }
</style>

<h3>Annotations</h3>
{#if sessionList.length == 0}
    No Annotations yet
{/if}

{#if sessionList.length > 0}
    <select id="session_list" multiple bind:value={sessionSelection}>
        {#each sessionList as session}
            <option value={session.id} title={session.title}>
                {session.title}
            </option>
        {/each}
    </select>

    <button on:click={clearSelection}>Clear Selection</button>

{/if}








