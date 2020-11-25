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

        /**
         * attaching a function to window context makes it callable from parent component
         * https://stackoverflow.com/questions/57954008/call-svelte-components-function-from-global-scope#57957607
         */
        window.togglePlayPause = () => {
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
