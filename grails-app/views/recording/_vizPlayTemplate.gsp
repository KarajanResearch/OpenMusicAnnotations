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

    .vizPlay.buttons {
        border-radius: 4px;
        padding: 2px 8px;
        margin: 4px;
    }
    .vizPlay.buttons:hover {
        background-color: #999999;
        color: white;
        text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.8);
    }

    #audio_player {
        border-radius: 4px;
        margin: 4px;
    }



</style>

<!-- dependency injection ;) -->
<input type="hidden" id="recordingId" value="${recording?.id}">
<input type="hidden" id="abstractMusicPartId" value="${recording?.abstractMusicPart?.id}">

<input type="hidden" id="waveFormUrl" value="${createLink(controller:'renderedWaveForm',action:'ajaxGetWaveForm')}">
<input type="hidden" id="imageSampleUrl" value="${createLink(controller:'renderedImageSample',action:'getImage')}">
<input type="hidden" id="scoreUrl" value="${createLink(controller:'abstractMusicPart',action:'getScoreFile')}">
<input type="hidden" id="beatDescriptionUrl" value="${createLink(controller:'recording',action:'getBeatDescription')}">



<div>
    <audio id="audio_player" controls preload="auto">
        <source src="${  createLink(controller: 'recording', action: 'getAudioFile', id: recording?.id, params: [type: "mp3"]) }"/> type="audio/wav">
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
    <div class="buttons">
        Zoom Score
        <button class="buttons vizPlay" id="score_zoom_out"> - </button>
        <button class="buttons vizPlay" id="score_zoom_in"> + </button>

        <span id="page_count"></span>
        <button class="buttons vizPlay" id="prev_page"> Prev. </button>
        <button class="buttons vizPlay" id="next_page"> Next </button>
    </div>


    <canvas id="score_canvas_left"></canvas>
    <canvas id="score_canvas_right"></canvas>


</div>


<script type="application/javascript">


    $(document).ready(function(){

        console.log("ready");

        /** get data from gsp rendering **/
        let recordingId = $("#recordingId").val();
        let abstractMusicPartId = $("#abstractMusicPartId").val();
        <g:applyCodec encodeAs="none">
        let annotationSessions = ${annotationSessionsJson};
        </g:applyCodec>

        // load UI
        let recordingViz = new RecordingViz(recordingId);
        let annotationIconView = recordingViz.openAnnotationIconView(annotationSessions);
        let sheetMusic = recordingViz.openSheetMusic(abstractMusicPartId);


    });




</script>

