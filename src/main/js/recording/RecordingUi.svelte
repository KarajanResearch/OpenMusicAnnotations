<script>
    import { onMount } from "svelte";
    import { createEventDispatcher } from 'svelte';
    import AudioPlayer from "./AudioPlayer.svelte";
    import DynamicWaveForm from "./DynamicWaveForm.svelte";

    // id of the grails recording object passed from the outside
    export let recordingId;

    // recording data structure loaded onMount
    let recording = {};

    const dispatch = createEventDispatcher();

    function forward(event) {
        dispatch('message', event.detail);
    }

    onMount(async () => {
        const res = await fetch("/recording/ajaxGet/"+recordingId);
        const ajaxData = await res.json();
        recording = ajaxData.recording;
    });



    /**
     * keyboard input on the waveform. used for pausing, tapping, annotation...
     * @param event
     */
    let key;
    let keyCode;
    function handleKeydown(event) {
        key = event.key;
        keyCode = event.keyCode;

        if(keyCode == 32) {
            console.log("space bar");
            // bound t0 window in sub-component
            onTogglePaused();

        }
    }

</script>

<svelte:window on:keydown={handleKeydown}/>



<p>This is recording: {recordingId}</p>

<p>
    {#if recording.id}
        {recording.title}
    {/if}
    {#if !recording.id}
       Loading...
    {/if}
</p>

<AudioPlayer recordingId={recordingId} />

<DynamicWaveForm recordingId={recordingId} />

<br/>
Key: {key}
<br />
KeyCode: {keyCode}