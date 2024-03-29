<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="main" />
    <g:set var="entityName" value="${message(code: 'recording.label', default: 'Recording')}" />
    <title>Compare Recordings</title>
</head>
<body>

<div class="nav" role="navigation">
    <ul>
        <li><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></li>
        <li><g:link class="list" action="index"><g:message code="default.list.label" args="[entityName]" /></g:link></li>
        <li><g:link class="create" action="create"><g:message code="default.new.label" args="[entityName]" /></g:link></li>
    </ul>
</div>
<div id="compare-recording" class="content scaffold-show" role="main">

    <h1>Compare Recordings</h1>


    <g:if test="${flash.message}">
        <div class="message" role="status">${flash.message}</div>
    </g:if>


    <!--
    IMPORTANT: compare is not reflexive. ui(x) != ui(x)
    UI cannot handle the case where one compares recording x with recording x
    -->


    <g:each var="recording" in="${this.recordings}" >
        <g:render template="recordingUiContainerTemplate" model="[recording: recording.recording, showScore: false, isMine: recording.isMine]" />
    </g:each>

<!-- invoce once, after all UI containers are set up -->
    <asset:javascript src="bundles/recordingUiBundle.js" />





</div>
</body>
</html>
