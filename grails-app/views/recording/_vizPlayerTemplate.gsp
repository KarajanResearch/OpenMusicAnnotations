<asset:javascript src="jquery-3.3.1.min.js"/>
<script src="//mozilla.github.io/pdf.js/build/pdf.js"></script>
<asset:javascript src="RecordingViz/ui.js"/>


<style type="text/css">

</style>



<div>
    <audio id="audio_player" controls preload="auto">
        <source src="${  createLink(controller: 'recording', action: 'getAudioFile', id: recording.id) }"/> type="audio/wav">
    Your browser does not support the audio element. </audio>
</div>


<div>
    <h1>Annotation Icons</h1>
    <canvas id="annotationIconView" style="border:1px solid #d3d3d3;"></canvas>
</div>


<div id="score">
    <h1>Score</h1>

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

    // load UI
    let recordingViz = new RecordingViz();

    <g:applyCodec encodeAs="none">
    let annotationSessions = ${annotationSessionsJson};
    let annotationIconView = recordingViz.openAnnotationIconView(annotationSessions);
    </g:applyCodec>

    // set pdf file for sheet music
    let sheetMusic = recordingViz.openSheetMusic("${createLink(controller: 'abstractMusicPart', action: 'getScoreFile', id: recording.abstractMusicPart.id)}");


</script>

