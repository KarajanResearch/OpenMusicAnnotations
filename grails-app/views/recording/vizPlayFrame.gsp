<%--
  Created by IntelliJ IDEA.
  User: martin
  Date: 3/27/20
  Time: 10:52 AM
--%>

<%@ page contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <title></title>

    <asset:stylesheet src="main.css"/>
    <asset:stylesheet src="application.css"/>
</head>

<body>

<g:render template="vizPlayTemplate" model="[recording: this.recording, showScore: false]" />

</body>
</html>