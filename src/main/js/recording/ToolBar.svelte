<script>
    import { onMount } from "svelte";

    // id of the grails recording object passed from the outside
    export let recordingId;

    const appContainer = window.$("#RecordingUiContainer-" + recordingId);

    /**
     * internal state
     */
    let zoomLevel = 4;
    let metronomeEnabled = true;
    let tapRecorderEnabled = true;

    let beatsPerBarList = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let beatsPerBar = 1;


    onMount(async () => {




    });



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
        width: 8em;
        left: 9em;
    }
    #toolbar_tap {
        border: 1px solid black;
        position: absolute;
        height: 100%;
        width: 15em;
        left: 18em;
    }
    #toolbar_tap {
        border: 1px solid black;
        position: absolute;
        height: 100%;
        width: 4em;
        left: 18em;
    }
    #toolbar_beat_per_bar {
        border: 1px solid black;
        position: absolute;
        height: 100%;
        width: 10em;
        left: 22em;
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

        appContainer.trigger("toggleMetronome");

    }}>(T)ap</button>
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
    Beats per Bar
    </span>

</div>