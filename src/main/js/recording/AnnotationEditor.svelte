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

        if (currentAnnotation.type === "Tap") {

            if (currentAnnotation.subdivision > 0) {
                currentAnnotation.labelText = `${currentAnnotation.bar}:${currentAnnotation.beat}:${currentAnnotation.subdivision}`;
            } else {
                currentAnnotation.labelText = `${currentAnnotation.bar}:${currentAnnotation.beat}`;
            }
        }

        // currentAnnotation.save();

        console.log(currentAnnotation);


        if (typeof (currentAnnotation.peaksPoint.update) !== "undefined") {
            currentAnnotation.peaksPoint.update({labelText: currentAnnotation.labelText});
        }

    }

    $: if(currentAnnotation.type === "Text") {
        currentAnnotation.labelText = currentAnnotation.stringValue;
        // currentAnnotation.save();
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
        width: 3em;
    }
    #subDivision {
        width: 2em;
    }

</style>


{#if visible}
    <div transition:fade>


        {#if (currentAnnotation.type === "Tap")}
            <h3>Edit Tap: {currentAnnotation.labelText}</h3>
            <label for="barNumber">Bar:Beat:Sub</label>
            <span>
                <input id="barNumber" type="number" bind:value={currentAnnotation.bar} min="1" />:
                <input id="beatNumber" type="number" bind:value={currentAnnotation.beat} min="1" />:
                <input id="subDivision" type="number" bind:value={currentAnnotation.subdivision} min="0" />
            </span>
        {/if}

        {#if (currentAnnotation.type === "Text")}
            <h3>Edit Text</h3>
            <label for="stringValue">Text</label>
            <input id="stringValue"
               bind:value={currentAnnotation.stringValue}
               on:focus={ () => appContainer.trigger("focusOnTextInput", true) }
               on:focusout={ () => appContainer.trigger("focusOnTextInput", false) }
            >
        {/if}

        <br/>
        <button class="buttons" on:click={e => {
            currentAnnotation.save();
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




