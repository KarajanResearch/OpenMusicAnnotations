<script>
    import { onMount } from "svelte";
    import Peaks from 'peaks.js';

    // id of the grails recording object passed from the outside
    export let recordingId;

    const appContainer = window.$("#RecordingUiContainer-" + recordingId);


    let peaks = {};


    onMount(async () => {

        // https://github.com/bbc/peaks.js#configuration
        const options = {
            containers: {
                overview: document.getElementById('overview-container_'+recordingId),
                zoomview: document.getElementById('zoomview-container_'+recordingId)
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

        /**
         * handler for changing the zoom level from tool menu
         */
        appContainer.on("setWaveFormZoom", function (event, newZoomLevel) {
            peaks.zoom.setZoom(newZoomLevel);
        });

        /**
         * handler for adding points to peaks
         * annotation has peaks.js point format: { time, editable, color, labelText, id }
         */
        appContainer.on("drawAnnotation", function (event, annotation) {
            peaks.points.add(annotation);
        });
        appContainer.on("clearAllAnnotations", function (event) {
            peaks.points.removeAll();
        });




    });




</script>

<style>

</style>


<div id="zoomview-container_{recordingId}"/>
<div id="overview-container_{recordingId}"/>
