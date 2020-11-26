<script>
    import { onMount } from "svelte";
    import AudioPlayer from "./AudioPlayer.svelte";
    import ToolBar from "./ToolBar.svelte";
    import DynamicWaveForm from "./DynamicWaveForm.svelte";

    // id of the grails recording object passed from the outside
    export let recordingId;

    // recording data structure loaded onMount
    let recording = {};

    // we reference the div containing the app for event dispatching
    const appContainer = window.$("#RecordingUiContainer-" + recordingId);


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

    //RecordingUiContainer-${this.recording.id}
    appContainer.keydown(function (event){


        let key = event.key;
        let keyCode = event.keyCode;

        if(keyCode == 32) {
            // Space Bar
            event.preventDefault();
            appContainer.trigger("togglePlayPause");
        }
    });

</script>


<style>
    #recording_ui_container {
        border: 1px solid;
        position: relative;
        width: 100%;
        height: 36em;
    }

    #recording_ui_transport {
        border: 1px solid;
        position: absolute;
        width: 21em;
    }
    #recording_ui_toolbar {
        border: 1px solid;
        position: absolute;
        left: 21em;
    }
    #recording_ui_trackbar {
        border: 1px solid;
        position: absolute;
        top: 3.5em;
        width: 10%;
    }
    #recording_ui_waveform {
        border: 1px solid;
        position: absolute;
        top: 3.5em;
        left: 10%;
        width: 90%;
    }
    #recording_ui_footer {
        border: 1px solid;
        position: absolute;
        left: 10%;
        top: 34em;
        width: 90%;
    }
</style>

{#if !recording.id}
    Loading... Please wait...
{/if}

{#if recording.id}
    <div id="recording_ui_container">

        <div id="recording_ui_transport">
            <AudioPlayer recordingId={recordingId} />
        </div>

        <div id="recording_ui_toolbar">
            <ToolBar recordingId={recordingId}/>
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
{/if}





