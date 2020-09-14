<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="main" />
    <g:set var="entityName" value="${message(code: 'user.label', default: 'User')}" />
    <title><g:message code="default.show.label" args="[entityName]" /></title>
</head>
<body>

<div class="nav" role="navigation">
    <ul>
        <li><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></li>
    </ul>
</div>
<div id="show-user" class="content scaffold-show" role="main">
    <h1><g:message code="default.show.label" args="[entityName]" /></h1>
    <g:if test="${flash.message}">
        <div class="message" role="status">${flash.message}</div>
    </g:if>
    <f:display bean="user" order="username, email"/>
</div>

<div id="show-user-token" class="content scaffold-show" role="main">
    <h1>API Token</h1>
    <f:table collection="${tokenList}" order="tokenValue, dateCreated" />
    <g:link controller="user" action="refreshToken">Create New Token</g:link>

</div>

<div id="show-user-expirePassword" class="content scaffold-show" role="main">
    <h1><g:link controller="user" action="passwordExpired">Change Password</g:link></h1>

</div>

</body>
</html>