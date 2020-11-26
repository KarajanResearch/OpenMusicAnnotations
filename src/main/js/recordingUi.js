import RecordingUi from './recording/RecordingUi.svelte'

// supporting multiple UIs per page. selecting all containers
let containers = window.$(".RecordingUiContainer").each(function (index) {
    let tokens = this.id.split("-");
    let recordingId = tokens[1];
    // ... and attach svelte app
    const recordingUi = new RecordingUi({
        target: this,
        props: {
            recordingId: recordingId
        }
    });
});


