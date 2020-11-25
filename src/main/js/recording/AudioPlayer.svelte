<script>
    import { onMount } from "svelte";

    // id of the grails recording object passed from the outside
    export let recordingId;

    let audioElement = {};
/*
    $: if(paused) {
        audioElement.pause();
    }
    $: if(!paused) {
        audioElement.play();
    }
*/


    let paused = true;

    onMount(async () => {

        audioElement = document.getElementById('audio_element_' + recordingId);
        window.onTogglePaused = () => {
            console.log("Audioplayer: " + paused);
            if (paused) {
                audioElement.play();
            } else {
                audioElement.pause();
            }
            paused = !paused;
        };



    });






</script>


<audio id="audio_element_{recordingId}" controls preload="auto">
    <source src="/recording/getAudioFile/{recordingId}" type="audio/wav" />
    <track src="" kind="captions" />
        Your browser does not support the audio element.
</audio>
Audio player paused: {paused}