<script>
    import { onMount } from "svelte";

    // id of the grails recording object passed from the outside
    export let recordingId;

    const appContainer = window.$("#RecordingUiContainer-" + recordingId);

    let sessionSelection = [];
    let sessionList = [];


    onMount(async () => {

        const res = await fetch("/recording/ajaxGetSessionList/"+recordingId);
        sessionList = await res.json();

    });


</script>

<style>
    #session_list {
        width: 100%;
    }
</style>

<h3>Annotations</h3>
{#if sessionList.length == 0}
    No Annotations yet
{/if}

{#if sessionList.length > 0}
    <select id="session_list" multiple bind:value={sessionSelection}>
        {#each sessionList as session}
            <option value={session.id}>
                {session.title}
            </option>
        {/each}
    </select>
{/if}







