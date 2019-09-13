<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="main" />
    <g:set var="entityName" value="${message(code: 'recording.label', default: 'Recording')}" />
    <title><g:message code="default.create.label" args="[entityName]" /></title>
</head>
<body>

<div class="nav" role="navigation">
    <ul>
        <li><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></li>
        <li><g:link class="list" action="index"><g:message code="default.list.label" args="[entityName]" /></g:link></li>
    </ul>
</div>
<div id="upload-audio" class="content scaffold-create" role="main">
    <h1>Audio Upload</h1>



    <g:uploadForm name="uploadRecordingFile" action="uploadRecordingFile">
        <g:hiddenField name="recordingId" value="${this.recording?.id}" />
        <g:hiddenField name="version" value="${this.recording?.version}" />
        <input type="file" name="recordingFile" />
        <fieldset class="buttons">
            <input class="save" type="submit" value="${message(code: 'default.button.upload.label', default: 'Upload')}" />
        </fieldset>
    </g:uploadForm>


</div>
</body>
</html>
