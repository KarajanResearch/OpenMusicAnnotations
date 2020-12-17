<style type="text/css">

    .recording-title {

    }

</style>


<g:if test="${this.recording.interpretation}">
    <p class="recording-title">
        <g:if test="${this.recording.interpretation.abstractMusicParts[0]}">
            <strong>
                ${this.recording.interpretation.abstractMusicParts[0]},
            </strong>
        </g:if>

        Interpretation:
        <g:link controller="interpretation" action="edit" resource="${this.recording.interpretation}">
            <strong>
                ${this.recording.interpretation},
            </strong>
        </g:link>

        Title:
        <g:link controller="recording" action="edit" resource="${this.recording}">
            ${this.recording.title},</g:link>
    </p>
</g:if>
<g:else>
    <p>${this.recording.title}
    <g:link controller="recording" action="edit" id="${this.recording.id}">
        <strong>
            Add Metadata
        </strong>
    </g:link>
    </p>
</g:else>


<div id="RecordingUiContainer-${this.recording.id}" class="RecordingUiContainer" tabindex="-1"></div>



