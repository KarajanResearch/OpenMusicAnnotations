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

    function deleteCurrentAnnotation() {

        console.log("remove from local state in session list");
        appContainer.trigger("deleteAnnotationFromSessionList", currentAnnotation);

        console.log("remove from peaks.js");
        appContainer.trigger("eraseAnnotation", currentAnnotation);

        console.log("remove from database");
        currentAnnotation.delete();
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
        <h3>Delete this Annotation</h3>
        <button class="buttons" on:click={e => {
            if (confirm("Are you sure? Deleting Annotations cannot be undone!")) {
                console.log(currentAnnotation);
                deleteCurrentAnnotation();
                visible = false;
            }
        }}>Delete</button>


    </div>
{/if}




