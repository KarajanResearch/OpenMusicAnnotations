<script>
    import { onMount } from "svelte";
    import Peaks from 'peaks.js';

    // id of the grails recording object passed from the outside
    export let recordingId;

    onMount(async () => {
/*
        const res = await fetch("/recording/ajaxGet/"+recordingId);
        const ajaxData = await res.json();
        recording = ajaxData.recording;
        console.log(recording);

 */
        const options = {
            containers: {
                overview: document.getElementById('overview-container'),
                zoomview: document.getElementById('zoomview-container')
            },
            mediaElement: document.querySelector('audio'),
            dataUri: '/recording/getPeaksFile/' + recordingId
        };
        Peaks.init(options, function(err, peaks) {
            // ...
        });
    });



</script>


<audio controls preload="auto">
    <source src="/recording/getAudioFile/{recordingId}" type="audio/wav" />
    <track src="" kind="captions" />
        Your browser does not support the audio element.
</audio>
<div id="overview-container"></div>
<div id="zoomview-container"></div>