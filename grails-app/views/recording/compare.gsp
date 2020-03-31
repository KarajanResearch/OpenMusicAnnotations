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

    <h1>Compare Recordings. <a href="#">Create Computational Musicology Notebook</a></h1>


    <g:if test="${flash.message}">
        <div class="message" role="status">${flash.message}</div>
    </g:if>

    <!--
    <style>
        .vizPlayFrame {
            width: fit-content;
        }
        html,body        {height: 100%;}
        .wrapper         {width: 100%; max-width: 100%; height: 1000px; margin: 0 auto; background: #CCC}
        .h_iframe        {position: relative; padding-top: 1000px; height: 100%}
        .h_iframe iframe {position: absolute; top: 0; left: 0; width: 100%; height: 100%;}
    </style>
-->

    <div class="wrapper">
        <g:each var="recording" in="${this.recordings}" >

            <div class="h_iframe">
                <h2>${recording.title}</h2>
                <iframe height="480" width="100%" allowfullscreen frameborder="0" src="${createLink(controller: "recording", action: "vizPlayFrame", id: recording.id)}">

                </iframe>
            </div>




        </g:each>
    </div>










</div>
</body>
</html>
