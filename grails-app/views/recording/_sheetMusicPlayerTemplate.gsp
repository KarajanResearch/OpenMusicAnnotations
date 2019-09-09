<asset:javascript src="jquery-3.3.1.min.js"/>


<div>
    <h1>Audio Player</h1>
    <audio id="audio_player" controls preload="auto">
        <source src="${recording.digitalAudio}"/> type="audio/mp3">
    Your browser does not support the audio element. </audio>
</div>



<script type="application/javascript">

    function audioPlayerLog(msg) {
        //$('<p>' + msg + '</p>').prependTo('#audio_player_console');
        console.log(msg);
    }


    $(function () {
        $('#audio_player').on('canplay', function () {
            //audioPlayerLog("canplay");

            //var widget = document.getElementById("audio_player");
            //audioPlayerLog(widget.currentTime);

        });
    });

    $(function () {
        $('#audio_player').on('loadedmetadata', function () {
            audioPlayerLog("loadedmetadata");
        });
    });

    $(function () {
        $('#audio_player').on('play', function () {
            audioPlayerLog("play");
        });
    });


    $(function () {
        $('#audio_player').on('timeupdate', function () {
            audioPlayerLog("ontimeupdate");
            var widget = document.getElementById("audio_player");
            // audioPlayerLog(widget.currentTime);

            if (widget.paused) {
                audioPlayerLog("prepared to play " + widget.currentTime);

            } else {
                audioPlayerLog("playing " + widget.currentTime);
            }
        });
    });


</script>

