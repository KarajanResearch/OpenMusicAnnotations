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


        <li>
            <g:if test="${this.recording.isShared}">
                <g:link class="share" action="unshare" id="${this.recording.id}" title="Click to make recording private">Unshare</g:link>
            </g:if>
            <g:else>
                <g:link class="share" action="share" id="${this.recording.id}" title="Click to read-only share recording">Share</g:link>
            </g:else>
        </li>

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





    <g:render template="vizPlayTemplate" model="[recording: this.recording, showScore: false]" />



    <g:form resource="${this.recording}" method="DELETE">
        <fieldset class="buttons">
            <g:link class="edit" action="edit" resource="${this.recording}"><g:message code="default.button.edit.label" default="Edit" /></g:link>


            <input class="delete" type="submit" value="${message(code: 'default.button.delete.label', default: 'Delete')}" onclick="return confirm('${message(code: 'default.button.delete.confirm.message', default: 'Are you sure?')}');" />


            <g:link class="upload" action="uploadTapping" resource="${this.recording}">
                <g:message code="default.button.uploadTapping.label" default="Upload Tapping" />
            </g:link>

        </fieldset>
    </g:form>





</div>
</body>
</html>
