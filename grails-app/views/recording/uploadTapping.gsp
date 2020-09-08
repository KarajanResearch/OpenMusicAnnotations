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

    <pre>
    5,106938776;3,1
    5,655510204;3,2
    6,230204082;3,3
    6,831020408;3,4
    7,41877551;4,1
    8,019591837;4,2
    8,633469388;4,3
    9,312653061;4,4
    </pre>

    <pre>
    1.9020408165,1.1
    3.2785714285,1.2
    4.4979591835,1.3
    5.752743764,2.1
    7.231564626,2.2
    8.5188208615,2.3
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
