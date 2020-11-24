<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="main" />
    <g:set var="entityName" value="${message(code: 'recording.label', default: 'Recording')}" />
    <g:if test="${this.recording.interpretation}">
        <title>${this.recording.interpretation}</title>
    </g:if>
    <g:else>
        <title>${this.recording.title}</title>
    </g:else>
</head>
<body>
<a href="#show-recording" class="skip" tabindex="-1"><g:message code="default.link.skip.label" default="Skip to content&hellip;"/></a>
<div class="nav" role="navigation">
    <ul>
        <li><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></li>
        <li><g:link class="list" action="index"><g:message code="default.list.label" args="[entityName]" /></g:link></li>
        <li><g:link class="create" action="create"><g:message code="default.new.label" args="[entityName]" /></g:link></li>



    </ul>
</div>
<div id="show-recording" class="content scaffold-show" role="main">


    <g:if test="${this.recording.interpretation}">
        <h1>
            <g:if test="${this.recording.interpretation.abstractMusicParts[0]}">
                Composition:
                <g:link controller="abstractMusicPart" action="show" resource="${this.recording.interpretation.abstractMusicParts[0]}">
                    ${this.recording.interpretation.abstractMusicParts[0]}
                </g:link>.
            </g:if>

            Interpretation:
            <g:link controller="interpretation" action="show" resource="${this.recording.interpretation}">
            ${this.recording.interpretation}
            </g:link>.

            Title:
            <g:link controller="recording" action="edit" resource="${this.recording}">
                ${this.recording.title}
            </g:link>.
        </h1>
    </g:if>
    <g:else>
        <h1>${this.recording.title}
            <g:link controller="recording" action="edit" id="${this.recording.id}">
                Add Metadata
            </g:link>
        </h1>
    </g:else>



    <g:if test="${flash.message}">
        <div class="message" role="status">${flash.message}</div>
    </g:if>


    <input hidden="hidden" id="recordingId" value="${this.recording.id}">
    <div id="RecordingUiContainer">

    </div>

    <asset:javascript src="bundles/recordingUiBundle.js" />




</div>
</body>
</html>
