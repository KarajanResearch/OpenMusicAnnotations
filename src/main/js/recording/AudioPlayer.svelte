<script>
    import { onMount } from "svelte";

    // id of the grails recording object passed from the outside
    export let recordingId;

    const appContainer = window.$("#RecordingUiContainer-" + recordingId);

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
        appContainer.on("togglePlayPause", function (){
            if (paused) {
                audioElement.play();
            } else {
                audioElement.pause();
            }
            paused = !paused;
        });


        appContainer.on("getAudioPlayerPosition", function (event, callback) {
            callback(audioElement.currentTime);
        });

    });


</script>

<style>
    .audio_player {
        border-radius: 4px;
        margin: 4px;
        display: inline-block;
        vertical-align: top;
    }
</style>


<audio id="audio_element_{recordingId}" class="audio_player" controls preload="auto" controlsList="nodownload">
    <source src="/recording/getAudioFile/{recordingId}" type="audio/wav" />
    <track src="" kind="captions" />
        Your browser does not support the audio element.
</audio>

