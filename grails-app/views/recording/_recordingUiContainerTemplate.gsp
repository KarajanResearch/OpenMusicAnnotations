
<g:if test="${this.recording.interpretation}">
    <h1>
        <g:if test="${this.recording.interpretation.abstractMusicParts[0]}">
            Composition:
            <g:link controller="abstractMusicPart" action="show" resource="${this.recording.interpretation.abstractMusicParts[0]}">
                ${this.recording.interpretation.abstractMusicParts[0]},</g:link>
        </g:if>

        Interpretation:
        <g:link controller="interpretation" action="show" resource="${this.recording.interpretation}">
            ${this.recording.interpretation},</g:link>

        Title:
        <g:link controller="recording" action="edit" resource="${this.recording}">
            ${this.recording.title},</g:link>
    </h1>
</g:if>
<g:else>
    <h1>${this.recording.title}
    <g:link controller="recording" action="edit" id="${this.recording.id}">
        Add Metadata
    </g:link>
    </h1>
</g:else>


<div id="RecordingUiContainer-${this.recording.id}" class="RecordingUiContainer" tabindex="-1"></div>



