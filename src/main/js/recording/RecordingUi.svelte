<script>
    import { onMount } from "svelte";
    import AudioPlayer from "./AudioPlayer.svelte";

    // id of the grails recording object passed from the outside
    export let recordingId;

    // recording data structure loaded onMount
    let recording = {}

    onMount(async () => {
        const res = await fetch("/recording/ajaxGet/"+recordingId);
        const ajaxData = await res.json();
        recording = ajaxData.recording;
        console.log(recording);
    });

</script>


<p>This is recording: {recordingId}</p>

<p>
    {#if recording.id}
        {recording.title}
    {/if}
    {#if !recording.id}
       Loading...
    {/if}
</p>

<AudioPlayer recordingId="{recordingId}"/>