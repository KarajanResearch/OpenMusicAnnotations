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
                src="http://localhost:5173/testSession"
                title="UI"
                width="100%"
                height="100%">
        </iframe>
    </g:if>
    <g:else>

    </g:else>




    </body>
</html>