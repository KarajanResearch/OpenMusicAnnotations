<!doctype html>
<html>
<head>
    <meta name="layout" content="main"/>
    <title>Welcome to Grails</title>
</head>
<body>

    <content tag="nav">

    </content>



<div class="svg" role="presentation">
    <div class="grails-logo-container">
        <asset:image src="index-header.jpg" class="grails-logo"/>

    </div>
</div>

<div id="content" role="main">
    <section class="row colset-2-its">
        <h1>Open Music Annotations</h1>

        Welcome. This is the Open Music Annotation Cloud.

        <style>
        #search-form {
            break-before: always;
            margin-left: auto;
            margin-right: auto;
            width: 60em;
            margin-top: 2em;
            margin-bottom: 2em;
        }

        ul#recording-search-results li {
            padding: 1em;

        }

        </style>

        <div id="search-form">
            <asset:javascript src="jquery-3.3.1.min.js"/>

            <script type="application/javascript">
                /**
                 * callbacks for JS search
                 */

                function recordingSearchReady() {
                    console.log("recording SearchReady");
                }

                function recordingSelected(id, name) {
                    console.log("recording Selected: " + name + ": " + id);
                    console.log(name);
                    //$("#composerResultName").val(name);
                    let showUrl="${createLink(controller: 'recording', action:'show')}";
                    showUrl = showUrl + "/" + id;
                    console.log(showUrl);
                    window.open(showUrl, "_self");
                }
            </script>

            <g:render template="/shared/searchTemplate" model="[searchBean: 'recording', searchBase: 'null', onReady: 'recordingSearchReady', onSelected: 'recordingSelected']" />




        </div>



    </section>
</div>

</body>
</html>
