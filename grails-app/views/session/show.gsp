<!DOCTYPE html>
<html>
    <head>
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'session.label', default: 'Session')}" />
        <title><g:message code="default.show.label" args="[entityName]" /></title>


        <!-- LOAD AFTER jquery -->
        <asset:stylesheet src="datatables.css" />
        <asset:javascript src="datatables.js" />
        <script type="application/javascript">
            /**
             * setup dataTable
             */
            $(document).ready( function () {


                // install event handler for getFocus
                // to reload interpretationSelection table
                $(window).focus(function() {
                    // console.log('welcome (back)');
                    // location.reload();
                });

                $(window).blur(function() {
                    //console.log('bye bye');
                });


                // see datatables manual for configuration details. every parameter is important!

                var table = $('#annotationsTable').DataTable( {
                        "autoWidth": false,
                        "scrollX": false,
                        stateSave: true,
                        "deferRender": true,
                        dom: 'lfrtiBp',
                        order: [[3, "asc"]],
                        buttons: [
                            /*"copy", 'excel', 'pdf'*/
                        ],
                        select: {
                            style: 'single'
                        },
                        ajax: {
                            url: '${createLink(controller: "session", action: "ajaxGetAnnotations", params: [session: this.session.id])}',
                            dataSrc: ''
                        },
                        rowId: 'id',
                        columns: [
                            {data: 'type'},
                            {data: 'barNumber'},
                            {data: 'beatNumber'},
                            {data: 'momentOfPerception'}
                        ]
                    } // options
                ); //table

            } ); // ready



        </script>





    </head>
    <body>
        <a href="#show-session" class="skip" tabindex="-1"><g:message code="default.link.skip.label" default="Skip to content&hellip;"/></a>
        <div class="nav" role="navigation">
            <ul>
                <li><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></li>

            </ul>
        </div>
        <div id="show-session" class="content scaffold-show" role="main">
            <h1><g:message code="default.show.label" args="[entityName]" /></h1>
            <g:if test="${flash.message}">
            <div class="message" role="status">${flash.message}</div>
            </g:if>


            <f:display bean="session" order="title, isShared"/>



            <table id="annotationsTable">
                <thead>
                <tr>
                    <th>Type</th>
                    <th>Bar</th>
                    <th>Beat</th>
                    <th>Moment of Perception</th>
                </tr>
                </thead>
            </table>



            <g:form resource="${this.session}" method="DELETE">
                <fieldset class="buttons">

                    <g:if test="${this.isMine}">
                        <g:link class="edit" action="edit" resource="${this.session}"><g:message code="default.button.edit.label" default="Edit" /></g:link>
                        <input class="delete" type="submit" value="${message(code: 'default.button.delete.label', default: 'Delete')}" onclick="return confirm('${message(code: 'default.button.delete.confirm.message', default: 'Are you sure?')}');" />


                        <g:if test="${this.session.isShared}">
                            <g:link class="share" action="unshare" id="${this.session.id}" title="Click to make session data private">Unshare</g:link>
                        </g:if>
                        <g:else>
                            <g:link class="share" action="share" id="${this.session.id}" title="Click to share session read-only">Share</g:link>
                        </g:else>


                    </g:if>
                    <g:else>
                        Read-Only
                    </g:else>





                </fieldset>
            </g:form>
        </div>
    </body>
</html>
