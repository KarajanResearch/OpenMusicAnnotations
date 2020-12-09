<script>
    import { onMount } from "svelte";
    import { fade } from 'svelte/transition';
    import Annotation from "./Annotation";

    // id of the grails recording object passed from the outside
    //export let annotationId;
    export let recordingId;

    let currentAnnotation = new Annotation("", 0.0, true, "", "");
    let visible = false;

    const appContainer = window.$("#RecordingUiContainer-" + recordingId);


    onMount(async () => {

        /**
         * attaching a function to window context makes it callable from parent component
         * https://stackoverflow.com/questions/57954008/call-svelte-components-function-from-global-scope#57957607
         */
        appContainer.on("editAnnotation", function (event, point){

            // save reference to point for online-editing
            point.annotation.peaksPoint = point;
            currentAnnotation = point.annotation;
            visible = true;
        });

    });

    $: {
        currentAnnotation.bar;
        currentAnnotation.beat;

        currentAnnotation.labelText = `${currentAnnotation.bar}:${currentAnnotation.beat}`;

        currentAnnotation.save();

        console.log(currentAnnotation);


        if (typeof (currentAnnotation.peaksPoint.update) !== "undefined") {
            currentAnnotation.peaksPoint.update({labelText: currentAnnotation.labelText});
        }

    }

</script>

<style>
    #barNumber {
        width: 4em;
    }
    #beatNumber {
        width: 4em;
    }

</style>


{#if visible}
    <div transition:fade>
        <h3>Edit Annotation</h3>

        {#if (currentAnnotation.type === "tap")}
        <label for="barNumber">Bar</label>
        <input id="barNumber" type="number" bind:value={currentAnnotation.bar} min="1" />
        <label for="beatNumber">Beat</label>
        <input id="beatNumber" type="number" bind:value={currentAnnotation.beat} min="1" />
        {/if}
        <br/>
        <button class="buttons" on:click={e => {
            visible = false;
        }}>Done</button>

    </div>
{/if}




