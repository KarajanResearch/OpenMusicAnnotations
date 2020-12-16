<script>
    import { onMount } from "svelte";
    import Annotation from "./Annotation.js";

    // id of the grails recording object passed from the outside
    export let recordingId;

    const appContainer = window.$("#RecordingUiContainer-" + recordingId);
    const clickPlayer = document.getElementById("click-sound-" + recordingId);

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


    let textAnnotationStringValue = "";

    onMount(async () => {

        //attach tap event handler to appContext to receive keyboard input
        appContainer.on("keyboardTap", function (){
            addNewAnnotation();
        });

    });



    function addNewAnnotation(event) {

        let barNumber = currentBar + currentBarOffset - 1;

        appContainer.trigger("getAudioPlayerPosition", function (playerPosition) {

            if (metronomeEnabled === true) {
                console.log("click");
                clickPlayer.pause();
                clickPlayer.currentTime = 0;
                clickPlayer.play();
            }

            let annotation = new Annotation( {
                time: playerPosition,
                bar: barNumber,
                beat: currentBeat
            });

            // button "contains" the next beat to add.
            // 1. step. add beat to annotations
            appContainer.trigger("addAnnotationToNewSession", annotation);
        });

        // 2. step: increment beat for the next click
        currentBeat = currentBeat + 1;

    }

    function addTextAnnotation(event) {
        appContainer.trigger("getAudioPlayerPosition", function (playerPosition) {

            let annotation = new Annotation( {
                time: playerPosition,
                type: "Text",
                stringValue: textAnnotationStringValue
            });

            // button "contains" the next beat to add.
            // 1. step. add beat to annotations
            appContainer.trigger("addAnnotationToNewSession", annotation);
        });

    }





</script>

<style>

    #toolbar_zoom {
        /*border: 1px solid black;*/
        position: absolute;
        width: 8em;
        left: 2em;
    }
    #toolbar_click {
        /* border: 1px solid black; */
        position: absolute;
        height: 100%;
        width: 8em;
        left: 11em;
    }
    #toolbar_tap {
        /* border: 1px solid black; */
        position: absolute;
        height: 100%;
        width: 7em;
        left: 20em;
    }
    #toolbar_beat_per_bar {
        /* border: 1px solid black; */
        position: absolute;
        height: 100%;
        width: 20em;
        left: 27em;
    }
    #current_bar_offset_input {
        width: 4em;
    }

    #toolbar_text_annotation {
        /* border: 1px solid black; */
        position: absolute;
        height: 100%;
        width: 38em;
        left: 47em;
    }
    #button_add_text {
        left: 32em;
    }
    #input_text_annotation {
        left: 10em;
        width: 22em;
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


<div id="toolbar_text_annotation">

    <label class="vertical_center" for="input_text_annotation">Add Text Annotation:</label>
    <input id="input_text_annotation" class="vertical_center"
           bind:value={textAnnotationStringValue}
           on:focus={ () => appContainer.trigger("focusOnTextInput", true) }
           on:focusout={ () => appContainer.trigger("focusOnTextInput", false) }
    >
    <button id="button_add_text" class="buttons vertical_center" on:click={e => {

        addTextAnnotation(e);
        textAnnotationStringValue = "";

    }}>Add Text</button>

</div>