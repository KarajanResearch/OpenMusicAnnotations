<script>
    import { onMount } from "svelte";
    import { fade } from 'svelte/transition';
    import Annotation from "./Annotation";

    // id of the grails recording object passed from the outside
    //export let annotationId;
    export let recordingId;

    let currentAnnotation = new Annotation("", 0.0, true, "", "");
    let visible = true;

    const appContainer = window.$("#RecordingUiContainer-" + recordingId);


    onMount(async () => {

        /**
         * attaching a function to window context makes it callable from parent component
         * https://stackoverflow.com/questions/57954008/call-svelte-components-function-from-global-scope#57957607
         */
        appContainer.on("editAnnotation", function (event, point){

            console.log("editing:");
            console.log(point);

            console.log(Annotation.fromPeaksPoint(point));

            visible = true;
            currentAnnotation = Annotation.fromPeaksPoint(point);

        });


    });

</script>

<style>

</style>


{#if visible}
    <div transition:fade>
        <h3>Edit Annotation</h3>

        {#if (typeof(currentAnnotation) !== "undefined")}
            {currentAnnotation.toString()}
        {/if}
    </div>
{/if}




