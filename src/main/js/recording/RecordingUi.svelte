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

<style>
    #recording_ui_container {
        border: 1px solid;
        position: relative;
        width: 100%;
        height: 38em;
    }

    #recording_ui_transport {
        border: 1px solid;
        position: absolute;
        width: 25em;
    }
    #recording_ui_toolbar {
        border: 1px solid;
        position: absolute;
        left: 25em;
    }
    #recording_ui_trackbar {
        border: 1px solid;
        position: absolute;
        top: 3.5em;
        width: 10em;
    }
    #recording_ui_waveform {
        border: 1px solid;
        position: absolute;
        top: 3.5em;
        left: 10em;
        width: 100%;
    }
    #recording_ui_footer {
        border: 1px solid;
        position: absolute;
        left: 10em;
        top: 36em;
        width: 100%;
    }
</style>




<div id="recording_ui_container">
    <p>
        {#if !recording.id}
            Loading... Please wait...
        {/if}
    </p>
    <div id="recording_ui_transport">
        <AudioPlayer recordingId={recordingId} />
    </div>

    <div id="recording_ui_toolbar">
        toolbar
    </div>

    <div id="recording_ui_trackbar">
        trackbar
    </div>

    <div id="recording_ui_waveform">
        <DynamicWaveForm recordingId={recordingId} />
    </div>

    <div id="recording_ui_footer">
        footer
    </div>
</div>


