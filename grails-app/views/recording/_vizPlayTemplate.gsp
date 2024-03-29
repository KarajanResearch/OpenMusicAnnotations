<asset:javascript src="jquery-3.3.1.min.js"/>
<script src="//mozilla.github.io/pdf.js/build/pdf.js"></script>
<asset:javascript src="RecordingViz/ui.js"/>



<asset:javascript src="node_modules_deprecated/peaks.js/peaks.js"/>


<style type="text/css">



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

    .vizPlay.buttons:active {
        background-color: #994a00;
        color: white;
        text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.8);
    }

    .vizPlay.select {
        background-color: #efefef;
        border-radius: 4px;
        padding: 2px 8px;
        margin: 4px;
        box-shadow: 0 0 3px 1px #aaaaaa;
        margin-top: 5px;
    }


    #toolMenu {
        /*padding-bottom: 10px; */
    }

    #audio_player {
        border-radius: 4px;
        margin: 4px;
        display: inline-block;
        vertical-align: top;
    }

    #toolMenuButtons {
        display: inline-block;
        vertical-align: top;
        background-color: #6f7443;
    }

    #toolMenuTimeSignature {
        display: inline-block;
        vertical-align: top;
        background-color: #595e74;
    }

    #toolMenuTempo {
        display: inline-block;
        vertical-align: top;
        background-color: #1c7430;
    }

    #sessionListContainer {
        display: inline-block;
        vertical-align: top;
        background-color: #0a6274;
    }

    #sessionList > li {
        display: inline-block;
        /* You can also add some margins here to make it look prettier */
        zoom:1;
        *display:inline;
        /* this fix is needed for IE7- */
    }

    #textAnnotationsContainer {
        display: inline-block;
        vertical-align: top;
        background-color: #1c7430;
    }
    #annotationText {
        margin-left: 3px;
    }

</style>

<!-- dependency injection ;) -->
<input type="hidden" id="recordingId" value="${recording?.id}">
<input type="hidden" id="waveFormUrl" value="${createLink(controller:'renderedWaveForm',action:'ajaxGetWaveForm')}">
<input type="hidden" id="imageSampleUrl" value="${createLink(controller:'renderedImageSample',action:'getImage')}">
<input type="hidden" id="scoreUrl" value="${createLink(controller:'abstractMusicPart',action:'getScoreFile')}">
<input type="hidden" id="beatDescriptionUrl" value="${createLink(controller:'recording',action:'getBeatDescription')}">
<input type="hidden" id="sessionListUrl" value="${createLink(controller:'recording',action:'ajaxGetSessionList')}">
<input type="hidden" id="sessionUrl" value="${createLink(controller:'recording',action:'ajaxGetSession')}">
<input type="hidden" id="sessionCreateUrl" value="${createLink(controller:'recording',action:'ajaxCreateSession')}">
<input type="hidden" id="sessionDeleteUrl" value="${createLink(controller:'recording',action:'ajaxDeleteSession')}">
<input type="hidden" id="sessionShowUrl" value="${createLink(controller:'session',action:'show')}">
<input type="hidden" id="annotationCreateUrl" value="${createLink(controller:'recording',action:'ajaxCreateAnnotation')}">
<input type="hidden" id="annotationDeleteUrl" value="${createLink(controller:'recording',action:'ajaxDeleteAnnotation')}">
<input type="hidden" id="annotationMoveUrl" value="${createLink(controller:'recording',action:'ajaxMoveAnnotation')}">




<div id="toolMenu">

    <audio id="audio_player" controls preload="none">
        <source src="${  createLink(controller: 'recording', action: 'getAudioFile', id: recording?.id, params: [type: "wav"]) }" type="audio/wav" />
        <!--
    <source src="${  createLink(controller: 'recording', action: 'getAudioFile', id: recording?.id, params: [type: "mp3"]) }" type="audio/mpeg" />
    -->
        Your browser does not support the audio element. </audio>




    <!--
    <button class="buttons vizPlay" id="reload">reload</button>
    -->

    <div id="toolMenuButtons">
        <button class="buttons vizPlay" id="peaksZoomIn"> Zoom In </button>
        <button class="buttons vizPlay" id="peaksZoomOut"> Zoom Out </button>

    </div>

    <!--
    <div id="toolMenuTimeSignature">

        <select class="select vizPlay" id="timeSignatureList">
            <option value="0">2/4</option>
            <option value="1">3/4</option>
            <option value="2">4/4</option>
            <option value="3">6/4</option>
        </select>
    </div>
    -->

    <div id="toolMenuTempo">
        <!--<button class="buttons vizPlay" id="tapTempo" title="Click to add Tap Annotations"> Tap </button>-->
        <button class="buttons vizPlay" id="metronomeButton" title="Enable or Disable Metronome"> Click </button>
    </div>

    <div id="sessionListContainer" title="Select a Session to add Annotations">

        <select class="select vizPlay" id="sessionList">
            <option value="0">Loading...</option>
        </select>
        <g:if test="${this.isMine}">
            <button class="buttons vizPlay" id="clearSession" title="Clear the modifications on the selected Session"> Reset </button>
            <button class="buttons vizPlay" id="saveSession" title="Save the modifications on the selected Session"> Save </button>
            <button class="buttons vizPlay" id="deleteSession" title="Show/Edit/Delete the selected Session"> Edit </button>
        </g:if>
        <g:else>
            <button class="buttons vizPlay" id="deleteSession" title="Show Session"> Show </button>
        </g:else>

    </div>

    <div id="textAnnotationsContainer">


        <g:if test="${this.isMine}">
            <input type="text" id="annotationText" />
            <button class="buttons vizPlay" id="addAnnotationsText" title="Adding Annotation Text to Current Cursor Position"> Add </button>
        </g:if>

    </div>

</div>



<div id="stillProcessing">
    Audio file analysis and rendering in progress. Please be patient for a minute or so...
</div>
<div>
    <div id="peaks-container">
        <div id="zoomview-container"></div>
        <div id="overview-container"></div>
    </div>





<!--

    -->

</div>

<div id="contextHelp"></div>







<div id="score">
    <h2>Score</h2>
    <div class="buttons">
        <button class="buttons vizPlay" id="score_zoom_in"> Zoom In </button>
        <button class="buttons vizPlay" id="score_zoom_out"> Zoom Out </button>

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


        // load UI
        let recordingViz = new RecordingViz(recordingId);



        //var peaks = require()

        /**
         * adding peaks.js
         * after init, we overlay annotations to peaks waveform
         */
        (function(Peaks) {

            // https://github.com/bbc/peaks.js#configuration
            const options = {
                containers: {
                    overview: document.getElementById('overview-container'),
                    zoomview: document.getElementById('zoomview-container')
                },
                mediaElement: document.querySelector('audio'),
                dataUri: {
                    json: "${  createLink(controller: 'recording', action: 'getPeaksFile', id: recording?.id) }"
                },
                height: 200,
                zoomLevels: [32, 64, 128, 256, 512, 1024, 2048, 4096],
                emitCueEvents: true, /* https://github.com/bbc/peaks.js#events */
                // Color for the zoomable waveform
                zoomWaveformColor: 'rgba(0, 225, 128, 1)',
                // Color for the overview waveform
                overviewWaveformColor: 'rgba(0,150,0,1)',
                // Color for the overview waveform rectangle
                // that shows what the zoomable view shows
                overviewHighlightColor: 'rgb(200,42,0)',

                // Color of the play head text
                playheadTextColor: '#666666',
                showPlayheadTime: true,
                axisLabelColor: "#333333",

                // the color of a point marker
                pointMarkerColor: '#CCCCCC',

                keyboard: true,
                // Keyboard nudge increment in seconds (left arrow/right arrow)
                nudgeIncrement: 0.01,
            };

            Peaks.init(options, function(err, peaks) {
                console.log(peaks);
                let annotationIconView = recordingViz.openAnnotationIconView(peaks);
            });
        })(peaks, recordingViz);


        // load sheetMusic last
        let showSheetMusic = false;
        if (${this.showScore}) {
            let sheetMusic = recordingViz.openSheetMusic(abstractMusicPartId);
        } else {
            $("#score").remove();
        }


    });




</script>

