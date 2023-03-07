<!DOCTYPE html>
<html>
    <head>
        <meta name="layout" content="main" />
        <title>Karajan Research Data</title>

        <style>
        iframe {
            outline: none;
            border: none;
        }


        </style>

    </head>
    <body>

    <%
        String env = grails.util.Environment.current.name
    %>

    <g:if test="${env == 'development'}">
        <iframe
                src="http://localhost:5174/browse"
                title="UI"
                width="100%"
                height="100%">
        </iframe>
    </g:if>
    <g:else>
        <iframe
                src="https://tempo-data.oma.digital/browse.html"
                title="UI"
                width="100%"
                height="100%">
        </iframe>
    </g:else>

    </body>
</html>