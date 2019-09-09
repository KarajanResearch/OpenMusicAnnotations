<asset:javascript src="jquery-3.3.1.min.js"/>

<style type="text/css">
    #tap_tempo {
        float: left;
        margin: 10px;
    }
    #save_tap_list {
        /* float: left; */
        margin: 10px;
    }
</style>

<div>

    <div>
        <h1>Audio Player</h1>
        <audio id="audio_player" controls preload="auto">
            <source src="${recording.digitalAudio}"/> type="audio/mp3">
        Your browser does not support the audio element. </audio>

        <div id="current_time">current_time</div>
    </div>

    <div>
        <h1>Tap Tempo</h1>
        <button id="tap_tempo">Tap Tempo</button>
        <button id="save_tap_list">Save 0 Samples</button>

        <div id="tap_ist"></div>
        <div id="current_tempo">current_tempo</div>

    </div>



    <div>
        <h1>Visual Data</h1>
        <canvas id="viz" style="border:1px solid #d3d3d3;"></canvas>
    </div>

</div>

<script type="application/javascript">

    // state
    var timer = 0.0;
    var lastTap = 0.0;
    var tapList = [];


    function uploadTapData() {

        var ajaxUrl="${createLink(controller:'recording',action:'ajaxUploadTapData')}";

        $.ajax({
            url:ajaxUrl,
            data: {
                tapList: tapList.join(";"),
                recording: "${recording.id}"
            },
            success: function(resp){
                console.log(resp);



                if (resp["Error"]) {
                    console.log(resp["Error"]);
                    return;
                }

                tapList = [];
                $("#save_tap_list").text("Saved!");

            }
        });


    }

    // getter and setter
    function updateTimer(time) {
        timer = time;
        //console.log("updated timer: " + time);
        $("#current_time").text(time);
        drawPlayHead(time);
    }

    function updateTapTempo(time) {
        //console.log("updated tempo: " + time);
        $("#current_tempo").text(time);
        tapList.push(time);
        //console.log(tapList);
        drawTapPoint(time);

        $("#tap_list").text(tapList.length);
        $("#save_tap_list").text("Save " + tapList.length + " Samples")
    }

    function audioPlayerLog(msg) {
        //$('<p>' + msg + '</p>').prependTo('#audio_player_console');
        console.log(msg);
    }


    // event handler
    $(function () {
        $('#audio_player').on('play', function () {
            audioPlayerLog("play");
        });
    });

    $(function () {
        $('#audio_player').on('timeupdate', function () {
            //audioPlayerLog("ontimeupdate");
            var widget = document.getElementById("audio_player");
            if (widget.paused) {
                audioPlayerLog("prepared to play " + widget.currentTime);
            } else {
                //audioPlayerLog("playing " + widget.currentTime);
                updateTimer(widget.currentTime);
            }
            drawPlayHead(widget.currentTime);
        });
    });

    $(function() {
       $("#tap_tempo").on("click", function() {
           var widget = document.getElementById("audio_player");

           if (widget.paused) {
               // no action
           } else {
               audioPlayerLog("tap at play head pos " + widget.currentTime);
               updateTapTempo(widget.currentTime);
           }
       });
    });


    $(function() {
        $("#save_tap_list").on("click", function() {

            uploadTapData();
        });
    });


    // init
    var canvas = document.getElementById("viz");
    var vizStartTime = 0.0;
    var vizDuration = 30.0; // seconds

    canvas.width = window.innerWidth;
    canvas.height = 200;

    console.log(canvas.width);


    var ctx = canvas.getContext("2d");


    // first the thin lines
    ctx.lineWidth = 1;


    // ten seconds frame...
    function clearCanvas(time) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        vizStartTime = time;
    }


    // maps a time event (tap at second 5.67) to x coords in the canvas
    // depending on width and viz duration
    function mapTime(time) {

        if (time > vizStartTime + vizDuration) {
            // redraw canvas and update startTime
            clearCanvas(time);
        }
        if (time < vizStartTime) {
            // redraw canvas and update startTime
            clearCanvas(time);
        }

        var pixPerSec = canvas.width / vizDuration;
        return (time - vizStartTime) * pixPerSec;
    }

    function drawTapPoint(time) {

        var pointRadius = 3;
        var x = mapTime(time);
        var y = canvas.height / 2;

        ctx.beginPath();
        ctx.arc(x, y, pointRadius, 0, 2 * Math.PI);
        ctx.stroke();

    }

    function drawPlayHead(time) {


        var pointRadius = 2;
        var x = mapTime(time);
        var y = canvas.height - 4;

        ctx.beginPath();
        ctx.arc(x, y, pointRadius, 0, 2 * Math.PI);
        ctx.stroke();

    }



</script>

