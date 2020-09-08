<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="main" />
    <g:set var="entityName" value="${message(code: 'recording.label', default: 'Recording')}" />
    <title>Upload Tapping</title>
</head>
<body>

<div class="nav" role="navigation">
    <ul>
        <li><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></li>
        <li><g:link class="list" action="index"><g:message code="default.list.label" args="[entityName]" /></g:link></li>
    </ul>
</div>
<div id="upload-audio" class="content scaffold-create" role="main">
    <h1>Tapping Upload for ${this.recording}</h1>

    A Tapping is a data file in CSV (or semi-colon separated on Windows) format.

    <h2>3-column format</h2>
    timestamp in seconds, tempo in bpm, beatNumber (3,1 or 3.1 means bar 3 beat 1. You can ommit the beatnumber if you only count bars. 3 means bar 3 beat 1)
    <pre>
        5,106938776;123,23;3,1
    or
        5.106938776,123.23,3.1
    </pre>

    <h2>2-column format</h2>
    timestamp in seconds, beatNumber (3,1 or 3.1 means bar 3 beat 1. You can ommit the beatnumber if you only count bars. 3 means bar 3 beat 1)
    <pre>
        5,106938776;3,1
    or
        5.106938776,3.1
    </pre>


    <g:uploadForm name="uploadTappingFile" action="uploadTappingFile">
        <g:hiddenField name="recordingId" value="${this.recording?.id}" />
        <g:hiddenField name="version" value="${this.recording?.version}" />
        <input type="file" name="tappingFile" />
        <fieldset class="buttons">
            <input class="save" type="submit" value="${message(code: 'default.button.upload.label', default: 'Upload')}" />
        </fieldset>
    </g:uploadForm>


</div>
</body>
</html>
