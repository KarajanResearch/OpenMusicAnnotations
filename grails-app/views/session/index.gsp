<!DOCTYPE html>
<html>
    <head>
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'session.label', default: 'Session')}" />
        <title><g:message code="default.list.label" args="[entityName]" /></title>

        <!-- LOAD AFTER jquery -->
        <asset:stylesheet src="datatables.css" />
        <asset:javascript src="datatables.js" />
    </head>
    <body>
        <a href="#list-session" class="skip" tabindex="-1"><g:message code="default.link.skip.label" default="Skip to content&hellip;"/></a>
        <div class="nav" role="navigation">
            <ul>
                <li><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></li>
                <li><g:link class="create" action="create"><g:message code="default.new.label" args="[entityName]" /></g:link></li>
            </ul>
        </div>
        <div id="list-session" class="content scaffold-list" role="main">
            <h1><g:message code="default.list.label" args="[entityName]" /></h1>
            <g:if test="${flash.message}">
                <div class="message" role="status">${flash.message}</div>
            </g:if>


            <table id="sessionList" class="display">
                <thead>
                <tr>
                    <th>Composer</th>
                    <th>Composition</th>
                    <th>Interpretation</th>
                    <th>Recording</th>
                    <th>Session</th>
                    <th>Shared</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>

                </tbody>

            </table>


            <script type="application/javascript">
                $(document).ready( function () {


                    $(window).focus(function() {
                        console.log('welcome (back)');
                        location.reload();
                    });



                    // change html table to DataTable
                    var table = $('#sessionList').DataTable( {
                            "scrollX": false,
                            stateSave: true,
                            select: {
                                style: 'multi'
                            },
                            dom: 'lfrtiBp',
                            deferRender: true,
                            pageLength: 25,

                            ajax: {
                                url: '${createLink(controller: "session", action: "ajaxIndex")}',
                                dataSrc: ''
                            },
                            rowId: 'id',
                            columns: [
                                {data: 'composerName'},
                                {data: 'abstractMusicTitle'},
                                {data: 'interpretationTitle'},
                                {data: 'recordingTitle'},
                                {data: 'title'},
                                {data: 'isShared'}

                            ],
                            columnDefs: [
                                {
                                    targets: 4,
                                    render: function (data, type, row) {
                                        // console.log(row.trackId);
                                        return '<a href="/session/show/' + row.id + '" target="_blank" >' + data + '</a>';
                                    }
                                },
                                {
                                    targets: 5,
                                    render: function (data, type, row) {
                                        // console.log(row.trackId);
                                        console.log(data);
                                        return data
                                    }
                                },
                                {
                                    targets: 6,
                                    render: function (data, type, row) {
                                        // console.log(row.trackId);
                                        if (row.isShared == "private") {
                                            return '<a href="/session/share/' + row.id + '" target="_blank" >share</a>';
                                        } else if (row.isShared == "shared") {
                                            return '<a href="/session/unshare/' + row.id + '" target="_blank" >unshare</a>';
                                        } else {
                                            return 'contact owner';
                                        }
                                    }
                                }
                            ],


                            buttons: [
                                /*
                                {
                                    text: 'Compare',
                                    action: function(e, dt, node, config) {
                                        var rows = table.rows( { selected: true } );
                                        let data = rows.data();
                                        if (data.length < 2) {
                                            return alert("Please select at least 2 rows for comparison");
                                        }
                                        let params = [];
                                        for (let i = 0; i < data.length; i++) {
                                            params.push("recording[]=" + data[i].id);
                                        }
                                        let url = "${createLink(controller:'session',action:'compare')}";
                                        url += "?" + params.join("&");
                                        window.location.href = encodeURI(url);
                                    }
                                },
                                {
                                    text: 'Python',
                                    action: function(e, dt, node, config) {
                                        var rows = table.rows( { selected: true } );
                                        let data = rows.data();
                                        if (data.length < 1) {
                                            return alert("Please select at least 1 rows for python comparison");
                                        }
                                        let params = [];
                                        for (let i = 0; i < data.length; i++) {
                                            console.log(data[i].id);
                                            params.push("recording[]=" + data[i].id);
                                        }
                                        let url = "${createLink(controller:'session',action:'python')}";
                                        url += "?" + params.join("&");
                                        window.location.href = encodeURI(url);
                                    }
                                },
                                */
                                {
                                    text: 'Open',
                                    action: function(e, dt, node, config) {
                                        console.log("Compare");
                                        var rows = table.rows( { selected: true } );

                                        let data = rows.data();
                                        let recordingId = data[0].id;

                                        let url = "${createLink(controller:'session',action:'show')}";
                                        url = url + "/" + recordingId.toString();
                                        console.log(url);

                                        window.location.href = encodeURI(url);
                                    }
                                }
                            ]
                        }
                    );
                });
            </script>





        </div>
    </body>
</html>