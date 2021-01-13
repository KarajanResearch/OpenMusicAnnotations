import SessionOceanUi from './sessionOcean/SessionOceanUi.svelte'

// supporting multiple UIs per page. selecting all containers
let containers = window.$(".SessionOceanUiContainer").each(function (index) {
    let tokens = this.id.split("-");
    let sessionId = tokens[1];
    // ... and attach svelte app
    const sessionOceanUi = new SessionOceanUi({
        target: this,
        props: {
            sessionId: sessionId
        }
    });
});


