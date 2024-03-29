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



    <g:if test="${flash.message}">
        <div class="message" role="status">${flash.message}</div>
    </g:if>




    <g:render template="recordingUiContainerTemplate" model="[recording: this.recording, showScore: false, isMine: this.isMine]" />
<!-- invoce once, after all UI containers are set up -->
    <asset:javascript src="bundles/recordingUi-bundle.js" />




    <g:form resource="${this.recording}" method="DELETE">
        <fieldset class="buttons">

            <g:if test="${ this.isMine }">

                <g:link class="edit" action="edit" resource="${this.recording}"><g:message code="default.button.edit.label" default="Edit" /></g:link>


                <input class="delete" type="submit" value="${message(code: 'default.button.delete.label', default: 'Delete')}" onclick="return confirm('${message(code: 'default.button.delete.confirm.message', default: 'Are you sure?')}');" />


                <g:link class="upload" action="uploadTapping" resource="${this.recording}">
                    <g:message code="default.button.uploadTapping.label" default="Upload Tapping" />
                </g:link>


                <g:if test="${this.recording.isShared}">
                    <g:link class="share" action="unshare" id="${this.recording.id}" title="Click to make recording private">Unshare</g:link>
                </g:if>
                <g:else>
                    <g:link class="share" action="share" id="${this.recording.id}" title="Click to read-only share recording">Share</g:link>
                </g:else>

            </g:if>
            <g:else>
                Read-Only
            </g:else>


        </fieldset>
    </g:form>





</div>
</body>
</html>
