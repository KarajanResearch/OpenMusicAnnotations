<!DOCTYPE html>
<html>
    <head>
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'recording.label', default: 'Recording')}" />
        <title><g:message code="default.edit.label" args="[entityName]" /></title>


        <!-- LOAD AFTER jquery -->
        <asset:stylesheet src="datatables.css" />
        <asset:javascript src="datatables.js" />
<script type="application/javascript">
    /**
     * setup dataTable
     */
    $(document).ready( function () {


        // see datatables manual for configuration details. every parameter is important!

        var table = $('#interpretationSelection').DataTable( {
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
                    url: '${createLink(controller: "interpretation", action: "ajaxIndex")}',
                    dataSrc: ''
                },
                rowId: 'id',
                columns: [
                    {data: 'composerName'},
                    {data: 'abstractMusicTitle'},
                    {data: 'abstractMusicPartTitle'},
                    {data: 'title'}
                ],
                columnDefs: [
                    {
                        targets: 3,
                        render: function (data, type, row) {
                            // console.log(row.trackId);
                            return '<a href="/interpretation/show/' + row.id + '" target="_blank" >' + data + '</a>';
                        }
                    }
                ],
                buttons: [
                    {
                        text: 'Apply to Recording',
                        action: function(e, dt, node, config) {
                            console.log("Apply to Recording");
                            var rows = table.rows( { selected: true } );
                            console.log(rows.data());

                            let data = rows.data();
                            let interpretationId = data[0].id;

                            $("select#interpretation").val(interpretationId);

                            let params = [];
                            for (let i = 0; i < data.length; i++) {
                                console.log(data[i].DT_RowId);
                                params.push("recording[]=" + data[i].DT_RowId);
                            }

                            let url = "${createLink(controller:'interpretation',action:'show')}";

                            console.log(url);

                            console.log(params.join("&"));

                            url += "?" + params.join("&");
                            console.log(url);

                            //window.location.href = encodeURI(url);

                        }
                    }
                ]


            }
        );



    } );



</script>
    </head>
    <body>
        <a href="#edit-recording" class="skip" tabindex="-1"><g:message code="default.link.skip.label" default="Skip to content&hellip;"/></a>
        <div class="nav" role="navigation">
            <ul>
                <li><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></li>
                <li><g:link class="list" action="index"><g:message code="default.list.label" args="[entityName]" /></g:link></li>
                <li><g:link class="create" action="create"><g:message code="default.new.label" args="[entityName]" /></g:link></li>
            </ul>
        </div>
        <div id="edit-recording" class="content scaffold-edit" role="main">
            <h1><g:message code="default.edit.label" args="[entityName]" />
                <g:link action="show" id="${this.recording.id}">(back to recording)</g:link>
            </h1>
            <g:if test="${flash.message}">
            <div class="message" role="status">${flash.message}</div>
            </g:if>
            <g:hasErrors bean="${this.recording}">
            <ul class="errors" role="alert">
                <g:eachError bean="${this.recording}" var="error">
                <li <g:if test="${error in org.springframework.validation.FieldError}">data-field-id="${error.field}"</g:if>><g:message error="${error}"/></li>
                </g:eachError>
            </ul>
            </g:hasErrors>
            <g:form resource="${this.recording}" method="PUT">
                <g:hiddenField name="version" value="${this.recording?.version}" />
                <fieldset class="form">
                    <f:all bean="recording" order="title"/>
                </fieldset>


                <!-- interpretation table -->
                <h2>What Interpretation was recorded?</h2>
                <p>
                    By interpretation we mean "the way the music was played" and use attributes like "conducted by Karajan".
                </p>

                <table id="interpretationSelection">
                    <thead>
                    <tr>
                        <th>Composer</th>
                        <th>Composition</th>
                        <th>Part</th>
                        <th>Title of Interpretation</th>
                    </tr>

                    </thead>


                </table>

                <fieldset class="form" disabled="disabled">
                    <f:all bean="recording" order="interpretation"/>
                </fieldset>




                <fieldset class="buttons">
                    <input class="save" type="submit" value="${message(code: 'default.button.update.label', default: 'Update')}" />
                </fieldset>
            </g:form>
        </div>
    </body>
</html>
