<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="main" />
    <title>Upload Score (*.pdf)</title>
</head>
<body>

<div class="nav" role="navigation">
    <ul>
        <li><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></li>
        <li><g:link class="list" action="index"><g:message code="default.list.label" args="[entityName]" /></g:link></li>
    </ul>
</div>
<div id="upload-audio" class="content scaffold-create" role="main">
    <h1>Upload Score (*.pdf)</h1>



    <g:uploadForm name="uploadScoreFile" action="uploadScoreFile">
        <g:hiddenField name="abstractMusicPartId" value="${this.abstractMusicPart?.id}" />
        <g:hiddenField name="version" value="${this.abstractMusicPart?.version}" />
        <input type="file" name="scoreFile" />
        <fieldset class="buttons">
            <input class="save" type="submit" value="Upload" />
        </fieldset>
    </g:uploadForm>


</div>
</body>
</html>
