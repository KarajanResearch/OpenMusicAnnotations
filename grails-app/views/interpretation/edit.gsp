<!DOCTYPE html>
<html>
    <head>
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'interpretation.label', default: 'Interpretation')}" />
        <title><g:message code="default.edit.label" args="[entityName]" /></title>


        <!-- LOAD AFTER jquery -->
        <asset:stylesheet src="datatables.css" />
        <asset:javascript src="datatables.js" />
        <script type="application/javascript">
            /**
             * setup dataTable
             */
            $(document).ready( function () {

                $(window).focus(function() {
                    console.log('welcome (back)');
                    location.reload();
                });

                // see datatables manual for configuration details. every parameter is important!

                var table = $('#compositionSelection').DataTable( {
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
                            url: '${createLink(controller: "abstractMusic", action: "ajaxIndex")}',
                            dataSrc: ''
                        },
                        rowId: 'id',
                        columns: [
                            {data: 'composerName'},
                            {data: 'title'}
                        ],
                        columnDefs: [
                            {
                                targets: 1,
                                render: function (data, type, row) {
                                    // console.log(row.trackId);
                                    return '<a href="/abstractMusic/show/' + row.id + '" target="_blank" >' + data + '</a>';
                                }
                            }
                        ],
                        buttons: [
                            {
                                text: 'Apply to Interpretation',
                                action: function(e, dt, node, config) {
                                    console.log("Apply to Interpretation");
                                    var rows = table.rows( { selected: true } );
                                    console.log(rows.data());

                                    let data = rows.data();
                                    let compositionId = data[0].id;
                                    let composerName = data[0].composerName;
                                    let compositionTitle = data[0].title;


                                    $("select#compositionId").append($('<option>').val(compositionId).text(composerName + ": " + compositionTitle));

                                    $("select#compositionId").val(compositionId);




                                }
                            }
                        ]


                    }
                );



            } );



        </script>


    </head>
    <body>
        <a href="#edit-interpretation" class="skip" tabindex="-1"><g:message code="default.link.skip.label" default="Skip to content&hellip;"/></a>
        <div class="nav" role="navigation">
            <ul>
                <li><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></li>
            </ul>
        </div>
        <div id="edit-interpretation" class="content scaffold-edit" role="main">
            <h1><g:message code="default.edit.label" args="[entityName]" /></h1>
            <g:if test="${flash.message}">
            <div class="message" role="status">${flash.message}</div>
            </g:if>
            <g:hasErrors bean="${this.interpretation}">
            <ul class="errors" role="alert">
                <g:eachError bean="${this.interpretation}" var="error">
                <li <g:if test="${error in org.springframework.validation.FieldError}">data-field-id="${error.field}"</g:if>><g:message error="${error}"/></li>
                </g:eachError>
            </ul>
            </g:hasErrors>
            <g:form resource="${this.interpretation}" method="PUT">
                <g:hiddenField name="version" value="${this.interpretation?.version}" />
                <fieldset class="form">

                    <f:all bean="interpretation" order="title"/>

                    <g:if test="${this.interpretation.abstractMusicParts}">
                        <h2>Compositions played in this interpretation</h2>

                        <ul>
                            <g:each in="${this.interpretation.abstractMusicParts}" var="part">
                                <li>
                                    <g:link controller="abstractMusicPart" action="show" id="${part.id}">${part}</g:link>
                                    click <g:link controller="interpretation" action="removeComposition" params="${[interpretationId: this.interpretation.id, abstractMusicPartId: part.id]}" >here</g:link>
                                    to remove composition from interpretation
                                </li>

                            </g:each>
                        </ul>


                    </g:if>


                    <!-- Composition table -->
                    <h2>Add Composition to Interpretation</h2>

                    <p>
                        What Composition was interpreted?
                    </p>
                    <p>
                        By composition we mean "the way the music was written down" and use attributes like "written by Mozart".                  Use Search or   <g:link class="create" controller="abstractMusic" action="create" target="_blank">add Composition</g:link>

                    </p>

                    <table id="compositionSelection">
                        <thead>
                        <tr>
                            <th>Composer</th>
                            <th>Composition</th>
                        </tr>
                        </thead>
                    </table>

                    <f:field property="composition">
                        <g:select name="compositionId" from="${this.interpretation?.abstractMusicParts?.abstractMusic}" value="${this.interpretation.abstractMusicParts[0]?.abstractMusic?.id}" optionKey="id"></g:select>
                    </f:field>



                    <f:field property="PartOfComposition">
                        <g:textField name="abstractMusicPart" value="${this.interpretation.abstractMusicParts[0]?.title ? this.interpretation.abstractMusicParts[0]?.title : "First Movement"}" />
                    </f:field>





                </fieldset>
                <fieldset class="buttons">
                    <input class="save" type="submit" value="${message(code: 'default.button.update.label', default: 'Update')}" />
                </fieldset>
            </g:form>
        </div>
    </body>
</html>
