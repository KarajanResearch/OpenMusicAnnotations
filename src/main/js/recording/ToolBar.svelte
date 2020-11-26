<script>
    import { onMount } from "svelte";

    // id of the grails recording object passed from the outside
    export let recordingId;

    const appContainer = window.$("#RecordingUiContainer-" + recordingId);


    let zoomLevel = 4;



    onMount(async () => {




    });


    function handleZoomChange(event) {
        zoomLevel = event.target.value;
        console.log(zoomLevel);
        appContainer.trigger("setWaveFormZoom", zoomLevel);
    }


</script>

<style>
    #zoomSlider {
        direction: rtl;
        width: 7em;
    }
    .slider {
        -webkit-appearance: none;
        width: 100%;
        height: 15px;
        border-radius: 5px;
        background: #d3d3d3;
        outline: none;
        opacity: 0.7;
        -webkit-transition: .2s;
        transition: opacity .2s;
    }

    .slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #4CAF50;
        cursor: pointer;
    }

    .slider::-moz-range-thumb {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #4CAF50;
        cursor: pointer;
    }
</style>

<input id="zoomSlider" class="slider" type=range bind:value={zoomLevel} on:input={handleZoomChange} min="0" max="7" step="1">


