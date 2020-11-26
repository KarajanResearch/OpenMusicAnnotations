<%@ page import="org.karajanresearch.oma.music.Recording" %>
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

    <g:render template="recordingUiContainerTemplate" model="[recording: org.karajanresearch.oma.music.Recording.get(173192), showScore: false, isMine: this.isMine]" />

    <!-- invoce once, after all UI containers are set up -->
    <asset:javascript src="bundles/recordingUiBundle.js" />



</div>
</body>
</html>
