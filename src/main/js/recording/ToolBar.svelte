<script>
    import { onMount } from "svelte";
    import Annotation from "./Annotation.js";

    // id of the grails recording object passed from the outside
    export let recordingId;

    const appContainer = window.$("#RecordingUiContainer-" + recordingId);

    /**
     * internal state
     */
    let zoomLevel = 4;
    let metronomeEnabled = true;
    let tapRecorderEnabled = true;

    /**
     * Note on counting beats and bars:
     * We start at 1 instead of 0 (computer way) to match the semantics of musicology.
     */
    let beatsPerBarList = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let beatsPerBar = 1;
    let currentBeat = 1;
    let currentBar = 1;
    let currentBarOffset = 1;

    // handling changes in beatsPerBar. resetting current Beat and restart counting
    $: {
        beatsPerBar;
        currentBeat = 1;
        currentBar = 1;
    }

    $: if (currentBeat > beatsPerBar) {
        currentBeat = 1;
        currentBar = currentBar + 1;
    }

    $: {
        currentBarOffset;
        currentBeat = 1;
        currentBar = 1;
    }

    onMount(async () => {

        //attach tap event handler to appContext to receive keyboard input
        appContainer.on("keyboardTap", function (){
            addNewAnnotation();
        });

    });



    function addNewAnnotation(event) {

        let barNumber = currentBar + currentBarOffset - 1;

        appContainer.trigger("getAudioPlayerPosition", function (playerPosition) {

            let annotation = new Annotation( {
                time: playerPosition,
                labelText: `${barNumber}:${currentBeat}`
            });

            // button "contains" the next beat to add.
            // 1. step. add beat to annotations
            appContainer.trigger("addAnnotationToNewSession", annotation);
        });

        // 2. step: increment beat for the next click
        currentBeat = currentBeat + 1;

    }





</script>

<style>

    #toolbar_zoom {
        /*border: 1px solid black;*/
        position: absolute;
        width: 8em;
    }
    #toolbar_click {
        /* border: 1px solid black; */
        position: absolute;
        height: 100%;
        width: 8em;
        left: 9em;
    }
    #toolbar_tap {
        /* border: 1px solid black; */
        position: absolute;
        height: 100%;
        width: 15em;
        left: 18em;
    }
    #toolbar_tap {
        /* border: 1px solid black; */
        position: absolute;
        height: 100%;
        width: 7em;
        left: 18em;
    }
    #toolbar_beat_per_bar {
        /* border: 1px solid black; */
        position: absolute;
        height: 100%;
        width: 18em;
        left: 25em;
    }
    #current_bar_offset_input {
        width: 4em;
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
    <input id="zoomSlider" class="slider" type=range bind:value={zoomLevel} on:input={e => {
        zoomLevel = e.target.value;
        appContainer.trigger("setWaveFormZoom", zoomLevel);
    }} min="0" max="7" step="1">
</div>

<div id="toolbar_click">
    <button class="buttons vertical_center" on:click={e => {
        metronomeEnabled = !metronomeEnabled;
        appContainer.trigger("toggleMetronome");
    }}>Metronome {metronomeEnabled === true ? 'Off' : 'On'}</button>
</div>

<div id="toolbar_tap">
    <button class="buttons vertical_center" on:click={e => {


        addNewAnnotation(e);


    }}>(T)ap {currentBar + currentBarOffset - 1}:{currentBeat}</button>
</div>


<div id="toolbar_beat_per_bar">

    <span class="vertical_center">
        <select bind:value={beatsPerBar}>
        {#each beatsPerBarList as entry}
            <option value={entry}>
                {entry}
            </option>
        {/each}
        </select>
    Beats / Bar starting at
        <input id="current_bar_offset_input" type=number bind:value={currentBarOffset} min=1>
    </span>

</div>


