<asset:javascript src="jquery-3.3.1.min.js"/>
<script src="//mozilla.github.io/pdf.js/build/pdf.js"></script>
<asset:javascript src="RecordingViz/ui.js"/>

<asset:javascript src="concrete.js"/>



<asset:javascript src="node_modules/peaks.js/peaks.js"/>

<style type="text/css">

    #sessionList > li {
        display: inline-block;
        /* You can also add some margins here to make it look prettier */
        zoom:1;
        *display:inline;
        /* this fix is needed for IE7- */
    }

    #timelineContainer {
        display:inline-block;
        width: fit-content;
        height:40px;
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
        <source src="${  createLink(controller: 'recording', action: 'getAudioFile', id: recording?.id, params: [type: "mp3"]) }"/> type="audio/mpeg">
    Your browser does not support the audio element. </audio>
</div>
<div>
    <div id="peaks-container">
        <div id="zoomview-container"></div>
        <div id="overview-container"></div>
    </div>





<!--
    <h3>Available Sessions</h3>
    <div id="sessionListContainer">
        <ul id="sessionList">
            <li>Session 1</li>
            <li>Session 2</li>
        </ul>
    </div>
    -->

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
        let sheetMusic = recordingViz.openSheetMusic(abstractMusicPartId);



        //var peaks = require()

        /**
         * adding peaks.js
         * after init, we overlay annotations to peaks waveform
         */
        (function(Peaks) {

            const options = {
                containers: {
                    overview: document.getElementById('overview-container'),
                    zoomview: document.getElementById('zoomview-container')
                },
                mediaElement: document.querySelector('audio'),
                dataUri: {
                    json: "${  createLink(controller: 'recording', action: 'getPeaksFile', id: recording?.id) }"
                },
                emitCueEvents: true, /* https://github.com/bbc/peaks.js#events */
            };

            Peaks.init(options, function(err, peaks) {
                let annotationIconView = recordingViz.openAnnotationIconView(annotationSessions, peaks);
            });
        })(peaks, recordingViz);

    });




</script>

