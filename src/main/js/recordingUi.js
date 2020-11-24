import RecordingUi from './recording/RecordingUi.svelte'

// find app target container

let container = document.getElementById("RecordingUiContainer");

const recordingUi = new RecordingUi({
    target: container
});