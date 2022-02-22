<!DOCTYPE html>
<html>
    <head>
        <meta name="layout" content="main" />
        <title>Karajan Research Data</title>

        <!-- LOAD AFTER jquery -->


        <asset:javascript src="jszip.min.js" />
        <asset:stylesheet src="datatables/datatables.min.css" />
        <asset:javascript src="datatables/datatables.min.js" />

    </head>
    <body>
        <a href="#list-recording" class="skip" tabindex="-1"><g:message code="default.link.skip.label" default="Skip to content&hellip;"/></a>

        <div id="list-recording" class="content scaffold-list" role="main">
            <h1>Karajan Research Data</h1>

            <g:if test="${flash.message}">
                <div class="message" role="status">${flash.message}</div>
            </g:if>



            <table id="recordingList" class="display">
                <thead>
                <tr>
                    <th>Composer</th>
                    <th>Composition</th>
                    <th>Interpretation</th>
                    <th>Recording</th>
                </tr>
                </thead>
                <tbody>
                </tbody>

            </table>


            <script type="application/javascript">
                $(document).ready( function () {
                    var events = $('#events');
                    // change html table to DataTable
                    var table = $('#recordingList').DataTable( {
                            "scrollX": false,
                            stateSave: true,
                            select: {
                                style: 'multi'
                            },
                            dom: 'PlfrtiBp',
                            deferRender: true,
                            pageLength: 25,

                            searchPanes: {
                                cascadePanes: true,
                                layout: "columns-2",
                                // columns: [1, 2, 3, 4, 7, 8, 9]
                            },

                            ajax: {
                                url: '${createLink(controller: "data", action: "ajaxIndex")}',
                                dataSrc: ''
                            },
                            rowId: 'id',
                            columns: [
                                {data: "composerName"},
                                {data: 'abstractMusicTitle'},
                                {data: 'interpretationTitle'},
                                {data: 'title'}
                            ],
                            columnDefs: [
                                {
                                    searchPanes: {
                                        show: true,
                                    },
                                    targets: 0
                                },
                                {
                                    searchPanes: {
                                        show: true,
                                    },
                                    targets: 1
                                },
                                {
                                    searchPanes: {
                                        show: false,
                                    },
                                    targets: 2,
                                    render: function (data, type, row) {
                                        // console.log(row.trackId);
                                        return '<a href="/recording/show/' + row.id + '" target="_blank" >' + data + '</a>';
                                    }
                                },
                                {
                                    searchPanes: {
                                        show: false,
                                    },
                                    targets: 3
                                }
                            ],


                            buttons: [
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
                                        let url = "${createLink(controller:'recording',action:'compare')}";
                                        url += "?" + params.join("&");
                                        window.location.href = encodeURI(url);
                                    }
                                },
                                /*
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
                                        let url = "${createLink(controller:'recording',action:'python')}";
                                        url += "?" + params.join("&");
                                        window.location.href = encodeURI(url);
                                    }
                                },
                                */
                                {
                                    text: 'Download Selected',
                                    action: function(e, dt, node, config) {
                                        /*
                                        console.log("Compare");
                                        var rows = table.rows( { selected: true } );

                                        let data = rows.data();
                                        let recordingId = data[0].id;

                                        let url = "${createLink(controller:'recording',action:'show')}";
                                        url = url + "/" + recordingId.toString();
                                        console.log(url);

                                        window.location.href = encodeURI(url);
                                        */
                                        alert("Download in progress...")
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