
<g:if test="${this.recording.interpretation}">
    <h3>
        <g:if test="${this.recording.interpretation.abstractMusicParts[0]}">
            Composition:
                ${this.recording.interpretation.abstractMusicParts[0]},
        </g:if>

        Interpretation:
        <g:link controller="interpretation" action="edit" resource="${this.recording.interpretation}">
            ${this.recording.interpretation},</g:link>

        Title:
        <g:link controller="recording" action="edit" resource="${this.recording}">
            ${this.recording.title},</g:link>
    </h3>
</g:if>
<g:else>
    <h3>${this.recording.title}
    <g:link controller="recording" action="edit" id="${this.recording.id}">
        Add Metadata
    </g:link>
    </h3>
</g:else>


<div id="RecordingUiContainer-${this.recording.id}" class="RecordingUiContainer" tabindex="-1"></div>



