<!DOCTYPE html>
<html>
    <head>
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'recording.label', default: 'Recording')}" />
        <title><g:message code="default.list.label" args="[entityName]" /></title>

        <asset:javascript src="jquery-3.3.1.min.js" />

        <!-- LOAD AFTER jquery -->
        <asset:stylesheet src="datatables.css" />
        <asset:javascript src="datatables.js" />
    </head>
    <body>
        <a href="#list-recording" class="skip" tabindex="-1"><g:message code="default.link.skip.label" default="Skip to content&hellip;"/></a>
        <div class="nav" role="navigation">
            <ul>
                <li><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></li>
                <li><g:link class="create" action="create"><g:message code="default.new.label" args="[entityName]" /></g:link></li>
            </ul>
        </div>
        <div id="list-recording" class="content scaffold-list" role="main">
            <h1><g:message code="default.list.label" args="[entityName]" /></h1>
            <g:if test="${flash.message}">
                <div class="message" role="status">${flash.message}</div>
            </g:if>



            <table id="recordingList" class="display">
                <thead>
                <tr>
                    <th>Recording</th>
                    <th>Interpretation</th>
                    <th>Composition</th>
                    <th>Composer</th>
                    <th>Annotations</th>
                </tr>
                </thead>
                <tbody>
                <g:each in="${recordingList}" var="recording">

                    <tr id="${recording[0]}" class="context_menu_recording">
                        <td>
                            <g:link controller="recording" action="show" id="${recording[0]}">Show ${recording[1]}</g:link>
                        </td>
                        <td>
                            ${recording[2]}
                        </td>
                        <td>
                            ${recording[3]}
                        </td>
                        <td>
                            ${recording[4]}
                        </td>
                        <td>
                            ${recording[5]}
                        </td>

                    </tr>
                </g:each>
                </tbody>

            </table>



            <script type="application/javascript">
                $(document).ready( function () {

                    console.log("ready");

                    // change html table to DataTable after! preparing the mouseover event handler
                    $('#recordingList').DataTable( {
                            "scrollX": false
                        }
                    );
                });
            </script>


        </div>
    </body>
</html>