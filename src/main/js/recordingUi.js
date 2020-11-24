import RecordingUi from './recording/RecordingUi.svelte'

// find app target container
let container = document.getElementById("RecordingUiContainer");

// pass the recording id from gsp view
let recordingId = document.getElementById("recordingId").value;

const recordingUi = new RecordingUi({
    target: container,
    props: {
        recordingId: recordingId
    }
});