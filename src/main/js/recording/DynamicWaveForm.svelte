<script>
    import { onMount } from "svelte";
    import Peaks from 'peaks.js';

    // id of the grails recording object passed from the outside
    export let recordingId;

    let peaks = {};
    let zoomLevel = 0;


    onMount(async () => {

        // https://github.com/bbc/peaks.js#configuration
        const options = {
            containers: {
                overview: document.getElementById('overview-container'),
                zoomview: document.getElementById('zoomview-container')
            },
            mediaElement: document.getElementById('audio_element_' + recordingId),
            dataUri: {
                json: '/recording/getPeaksFile/' + recordingId
            },
            height: 200,
            zoomLevels: [32, 64, 128, 256, 512, 1024, 2048, 4096],
            emitCueEvents: true, /* https://github.com/bbc/peaks.js#events */
            // Color for the zoomable waveform
            zoomWaveformColor: 'rgba(0, 225, 128, 1)',
            // Color for the overview waveform
            overviewWaveformColor: 'rgba(0,150,0,1)',
            // Color for the overview waveform rectangle
            // that shows what the zoomable view shows
            overviewHighlightColor: 'rgb(200,42,0)',

            // Color of the play head text
            playheadTextColor: '#666666',
            showPlayheadTime: true,
            axisLabelColor: "#333333",

            // the color of a point marker
            pointMarkerColor: '#CCCCCC',

            keyboard: true,
            // Keyboard nudge increment in seconds (left arrow/right arrow)
            nudgeIncrement: 0.01,
        };


        peaks = Peaks.init(options, function(err, peaks) {
            // ...
        });


        peaks.zoom.setZoom(4);
        zoomLevel = 4;

    });


    function handleZoomChange(event) {
        zoomLevel = event.target.value;
        peaks.zoom.setZoom(zoomLevel);
    }


</script>

<style>
    #zoomSlider {
        direction: rtl;
        width: 7em;
        margin-bottom: 12px;
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




<div id="zoomview-container"/>
<div id="overview-container"/>
