<!DOCTYPE html>
<html>
    <head>
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'abstractMusic.label', default: 'AbstractMusic')}" />
        <title>Add Composition</title>

        <!-- LOAD AFTER jquery -->
        <asset:stylesheet src="datatables.css" />
        <asset:javascript src="datatables.js" />
        <script type="application/javascript">
            /**
             * setup dataTable
             */
            $(document).ready( function () {


                // see datatables manual for configuration details. every parameter is important!

                var table = $('#composerSelection').DataTable( {
                        "autoWidth": false,
                        "scrollX": false,
                        stateSave: true,
                        "deferRender": true,
                        dom: 'lfrtiBp',
                        buttons: [
                            /*"copy", 'excel', 'pdf'*/
                        ],
                        select: {
                            style: 'single'
                        },
                        ajax: {
                            /* url: '${createLink(controller: "composer", action: "ajaxIndex")}', */
                            url: '${createLink(controller: "composer", action: "ajaxIndex")}',
                            dataSrc: ''
                        },
                        rowId: 'href',
                        columns: [
                            {data: 'name'},
                            {data: 'livedAt'},
                            {data: 'href'},
                            ],
                        columnDefs: [
                            {
                                targets: 2,
                                render: function (data, type, row) {
                                    // console.log(row.trackId);
                                    return '<a href="https://en.wikipedia.org' + data + '" target="_blank" >' + data + '</a>';
                                }
                            }
                        ],
                        buttons: [
                            {
                                text: 'Apply to Composition',
                                action: function(e, dt, node, config) {
                                    console.log("Apply to Composition");
                                    var rows = table.rows( { selected: true } );
                                    console.log(rows.data());

                                    let data = rows.data();
                                    let composerWikiUrl = data[0].href;
                                    let composerName = data[0].name;


                                    $("#composerWikiUrl").val(composerWikiUrl);
                                    $("#composerWikiName").val(composerName);




                                }
                            }
                        ]


                    }
                );



            } );



        </script>

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

                    <f:field property="title">
                        <input type="text" id="title" name="title" value=""  />

                    </f:field>


                    <!-- Composition table -->
                    <h2>Composer</h2>

                    <p>
                        Use Search or   <g:link target="_blank" class="create" controller="composer" action="create">add Composer</g:link>
                    </p>

                    <table id="composerSelection">
                        <thead>
                        <tr>
                            <th>Composer</th>
                            <th>Info</th>
                            <th>Wikipedia</th>
                        </tr>
                        </thead>
                    </table>


                    <f:field property="composerWikiName">
                        <input type="text" id="composerWikiName" name="composerWikiName"  />

                    </f:field>

                    <f:field property="composerWikiUrl">
                        <input type="text" id="composerWikiUrl" name="composerWikiUrl"  />

                    </f:field>








                </fieldset>
                <fieldset class="buttons">
                    <g:submitButton name="create" class="save" value="${message(code: 'default.button.create.label', default: 'Create')}" />
                </fieldset>
            </g:form>
        </div>
    </body>
</html>
