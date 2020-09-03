<!DOCTYPE html>
<html>
    <head>
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'abstractMusicPart.label', default: 'AbstractMusicPart')}" />
        <title><g:message code="default.show.label" args="[entityName]" /></title>
    </head>
    <body>
        <a href="#show-abstractMusicPart" class="skip" tabindex="-1"><g:message code="default.link.skip.label" default="Skip to content&hellip;"/></a>
        <div class="nav" role="navigation">
            <ul>
                <li><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></li>

            </ul>
        </div>
        <div id="show-abstractMusicPart" class="content scaffold-show" role="main">
            <h1><g:message code="default.show.label" args="[entityName]" /></h1>
            <g:if test="${flash.message}">
            <div class="message" role="status">${flash.message}</div>
            </g:if>


            An abstract music part is a logical part of a composition, e.g., first movement. Abstract music denotes
            music that is not audio, e.g., sheet music or midi files.


            <f:display bean="abstractMusicPart" />
            <g:form resource="${this.abstractMusicPart}" method="DELETE">
                <fieldset class="buttons">


                    <g:link class="edit" action="edit" resource="${this.abstractMusicPart}"><g:message code="default.button.edit.label" default="Edit" /></g:link>

                    <!--
                    <g:link class="upload" action="upload" resource="${this.abstractMusicPart}"><g:message code="default.button.upload.label" default="Upload Sheet (*.pdf)" /></g:link>
                    -->

                </fieldset>
            </g:form>
        </div>
    </body>
</html>
