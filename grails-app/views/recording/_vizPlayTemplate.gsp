<asset:javascript src="jquery-3.3.1.min.js"/>
<script src="//mozilla.github.io/pdf.js/build/pdf.js"></script>
<asset:javascript src="RecordingViz/ui.js"/>

<asset:javascript src="concrete.js"/>

<style type="text/css">

    #sessionList > li {
        display: inline-block;
        /* You can also add some margins here to make it look prettier */
        zoom:1;
        *display:inline;
        /* this fix is needed for IE7- */
    }

    .waveFormSample {
        width: 32px;
        height: 200px;
    }

    #timelineContainer {
        display:inline-block;
        width: fit-content;
        height:400px;
        margin: 0 auto;
        background: antiquewhite;
        position:relative;

    }
    #waveForm {
        position: absolute;
        z-index: 1;
    }
    #timelineViewport {
        position:relative;
        z-index: 2;
    }

</style>

<!-- dependency injection ;) -->
<input type="hidden" id="recordingId" value="${recording?.id}">
<input type="hidden" id="waveFormUrl" value="${createLink(controller:'renderedWaveForm',action:'ajaxGetWaveForm')}">
<input type="hidden" id="imageSampleUrl" value="${createLink(controller:'renderedImageSample',action:'getImage')}">



<div>
    <audio id="audio_player" controls preload="auto">
        <source src="${  createLink(controller: 'recording', action: 'getAudioFile', id: recording?.id) }"/> type="audio/wav">
    Your browser does not support the audio element. </audio>
</div>


<div>
    <h2>Annotations</h2>
    <h3>Available Sessions</h3>
    <div id="sessionListContainer">
        <ul id="sessionList">
            <li>Session 1</li>
            <li>Session 2</li>
        </ul>
    </div>
    <h3>Timeline</h3>


    <div id="timelineContainer">
        <div id="waveForm">
            <div id="waveFormLeft"></div>
            <div id="waveFormRight"></div>
        </div>
        <div id="timelineViewport"></div>


<!--
        <canvas id="playHeadCanvas"></canvas>
        <canvas id="annotationIconView"></canvas>
        -->
    </div>




</div>


<div id="score">
    <h2>Score</h2>

    Zoom Score
    <button id="score_zoom_out"> - </button>
    <button id="score_zoom_in"> + </button>

    <span id="page_count"></span>
    <button id="prev_page"> Prev. </button>
    <button id="next_page"> Next </button>

    <canvas id="score_canvas_left"></canvas>
    <canvas id="score_canvas_right"></canvas>
    <div class="buttons">
    </div>
</div>


<script type="application/javascript">


    $(document).ready(function(){

        console.log("ready");



        let recordingId = $("#recordingId").val();

        // load UI
        let recordingViz = new RecordingViz(recordingId);

        <g:applyCodec encodeAs="none">
        let annotationSessions = ${annotationSessionsJson};



        let annotationIconView = recordingViz.openAnnotationIconView(annotationSessions);
        </g:applyCodec>

        // set pdf file for sheet music
        //let sheetMusic = recordingViz.openSheetMusic("${createLink(controller: 'abstractMusicPart', action: 'getScoreFile', id: 21287)}");


    });




</script>

