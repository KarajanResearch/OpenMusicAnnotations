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
     * events are propagated to components via functions attached to window context in sub components
     * @param event
     */
    function handleKeydown(event) {
        let key = event.key;
        let keyCode = event.keyCode;

        if(keyCode == 32) {
            // Space Bar
            // bound to window in sub-component
            window.togglePlayPause();
        }
    }

</script>

<svelte:window on:keydown={handleKeydown}/>

<p>
    {#if !recording.id}
       Loading... Please wait...
    {/if}
</p>

<AudioPlayer recordingId={recordingId} />

<DynamicWaveForm recordingId={recordingId} />

