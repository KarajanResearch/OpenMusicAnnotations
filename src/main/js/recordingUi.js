import RecordingUi from './recording/RecordingUi.svelte'

// supporting multiple UIs per page. selecting all containers
let containers = window.$(".RecordingUiContainer").each(function (index) {
    console.log(this);
    let tokens = this.id.split("-");
    let recordingId = tokens[1];
    const recordingUi = new RecordingUi({
        target: this,
        props: {
            recordingId: recordingId
        }
    });

});


