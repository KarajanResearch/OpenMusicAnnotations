<!DOCTYPE html>
<html>
    <head>
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'interpretation.label', default: 'Interpretation')}" />
        <title><g:message code="default.show.label" args="[entityName]" /></title>
    </head>
    <body>
        <a href="#show-interpretation" class="skip" tabindex="-1"><g:message code="default.link.skip.label" default="Skip to content&hellip;"/></a>
        <div class="nav" role="navigation">
            <ul>
                <li><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></li>
                <li><g:link class="create" action="create"><g:message code="default.new.label" args="[entityName]" /></g:link></li>
            </ul>
        </div>
        <div id="show-interpretation" class="content scaffold-show" role="main">
            <h1><g:message code="default.show.label" args="[entityName]" /></h1>
            <g:if test="${flash.message}">
            <div class="message" role="status">${flash.message}</div>

                <script type="application/javascript">
                    function close_window() {
                        window.close();
                    }
                </script>
                <a href="javascript:javascript:close_window();">Close tab and go back</a>

            </g:if>
            <f:display bean="interpretation" order="title, recordings"/>



            <ol class="property-list interpretation">

                <li class="fieldcontain">
                    <span id="title-label" class="property-label">Composition</span>
                    <div class="property-value" aria-labelledby="title-label">

                        <g:if test="${this.interpretation.abstractMusicParts}">
                            <ul>
                                <g:each in="${this.interpretation.abstractMusicParts}" var="part">
                                    <li>
                                        <g:link controller="abstractMusicPart" action="show" id="${part.id}">${part}</g:link>
                                    </li>
                                </g:each>
                            </ul>
                        </g:if>
                        <g:else>
                            <g:link id="${this.interpretation.id}" action="edit">
                                No composition added. Click to add information.
                            </g:link>

                        </g:else>

                    </div>
                </li>

            </ol>


            <g:form resource="${this.interpretation}" method="DELETE">
                <fieldset class="buttons">
                    <g:link class="edit" action="edit" resource="${this.interpretation}"><g:message code="default.button.edit.label" default="Edit" /></g:link>
                    <input class="delete" type="submit" value="${message(code: 'default.button.delete.label', default: 'Delete')}" onclick="return confirm('${message(code: 'default.button.delete.confirm.message', default: 'Are you sure?')}');" />
                </fieldset>
            </g:form>
        </div>
    </body>
</html>
