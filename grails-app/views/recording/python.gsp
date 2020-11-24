<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="main" />
    <title>Python Integration</title>
</head>
<body>

<div class="nav" role="navigation">
    <ul>
        <li><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></li>
    </ul>
</div>
<div id="compare-recording" class="content scaffold-show" role="main">

    <h1>Python Integration</h1>


    <g:if test="${flash.message}">
        <div class="message" role="status">${flash.message}</div>
    </g:if>



    <div class="pythonCode">

<pre>
recording_ids = ${this.recordings.id}
</pre>

    </div>










</div>
</body>
</html>
