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

    #toolbar_zoom {
        /*border: 1px solid black;*/
        position: absolute;
        width: 8em;
    }
    #toolbar_click {
        border: 1px solid black;
        position: absolute;
        height: 100%;
        width: 30em;
        left: 8em;
    }




    #zoomSlider {
        direction: rtl;
        width: 8em;
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

    .vertical_center {
        margin: 0;
        position: absolute;
        top: 50%;
        -ms-transform: translateY(-50%);
        transform: translateY(-50%);
    }

</style>

<div id="toolbar_zoom" class="vertical_center">
    <input id="zoomSlider" class="slider" type=range bind:value={zoomLevel} on:input={handleZoomChange} min="0" max="7" step="1">
</div>

<div id="toolbar_click">
    more tools go here
</div>
