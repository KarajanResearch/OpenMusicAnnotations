<!DOCTYPE html>
<html>
    <head>
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'abstractMusic.label', default: 'AbstractMusic')}" />
        <title>Add Composition</title>
    </head>
    <body>
        <a href="#create-abstractMusic" class="skip" tabindex="-1"><g:message code="default.link.skip.label" default="Skip to content&hellip;"/></a>
        <div class="nav" role="navigation">
            <ul>
                <li><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></li>
            </ul>
        </div>
        <div id="create-abstractMusic" class="content scaffold-create" role="main">
            <h1>Add Composition</h1>
            Provide the title of the composition. Composer information is added in the next step.
            <g:if test="${flash.message}">
            <div class="message" role="status">${flash.message}</div>
            </g:if>
            <g:hasErrors bean="${this.abstractMusic}">
            <ul class="errors" role="alert">
                <g:eachError bean="${this.abstractMusic}" var="error">
                <li <g:if test="${error in org.springframework.validation.FieldError}">data-field-id="${error.field}"</g:if>><g:message error="${error}"/></li>
                </g:eachError>
            </ul>
            </g:hasErrors>
            <g:form resource="${this.abstractMusic}" method="POST">
                <fieldset class="form">
                    <f:all bean="abstractMusic" order="title"/>






                </fieldset>
                <fieldset class="buttons">
                    <g:submitButton name="create" class="save" value="${message(code: 'default.button.create.label', default: 'Create')}" />
                </fieldset>
            </g:form>
        </div>
    </body>
</html>
