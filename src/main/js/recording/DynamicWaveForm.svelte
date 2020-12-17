<script>
    import { onMount } from "svelte";
    import Peaks from 'peaks.js';
    import Chart from "chart.js";
    import Annotation from "./Annotation";

    // id of the grails recording object passed from the outside
    export let recordingId;

    const appContainer = window.$("#RecordingUiContainer-" + recordingId);
    const clickPlayer = document.getElementById("click-sound-" + recordingId);

    let metronomeEnabled = true;
    let peaks = {};


    let width = 1400;
    let height = 200;

    let tempoAnnotationSessions = [];

    onMount(async () => {

        // https://github.com/bbc/peaks.js#configuration
        const options = {
            containers: {
                overview: document.getElementById('overview-container_'+recordingId),
                zoomview: document.getElementById('zoomview-container_'+recordingId)
            },
            mediaElement: document.getElementById('audio_element_' + recordingId),
            dataUri: {
                json: '/recording/getPeaksFile/' + recordingId
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


        peaks = Peaks.init(options, function(err, peaks) {
            // ...

            console.log("Peaks View");


            let view = peaks.views;
            console.log(view);


            width = peaks.views._overview._width;
            height = peaks.views._overview._height;


            let zoomview = peaks.views._zoomview;

            console.log("zoomview");
            console.log(zoomview);





            // TODO: mark peaks init done to enable other features
        });



        peaks.zoom.setZoom(4);


        /**
         * registering waveform events
         */
        peaks.on("zoom.update", function (currentZoomLevel, previousZoomLevel) {

            console.log("Zoom " + previousZoomLevel + " -> " + currentZoomLevel);

        });


        /**
         * click the metronome when entering a point
         */
        peaks.on("points.enter", function (point) {
            if (metronomeEnabled === false) return;
            clickPlayer.pause();
            clickPlayer.currentTime = 0;
            clickPlayer.play();
        });



        /**
         * updating SessionList when points are moved (dragged)
         */
        peaks.on("points.dragend", function (point) {
            // let sessionList handle that
            appContainer.trigger("updateAnnotationTime", point);
        });


        /**
         * editing annotations via double click: points.dblclick
         */
        peaks.on("points.dblclick", function (point) {
            // let annotationEditor handle that
            appContainer.trigger("editAnnotation", point);
        });





        /**
         * handler for changing the zoom level from tool menu
         */
        appContainer.on("setWaveFormZoom", function (event, newZoomLevel) {
            peaks.zoom.setZoom(newZoomLevel);
        });

        /**
         * handler for adding points to peaks
         * annotation has peaks.js point format: { time, editable, color, labelText, id }
         */
        appContainer.on("drawAnnotation", function (event, annotation) {

            if (typeof annotation.id === "undefined") {
                console.log("Error: annotation has no id");
                return;
            }

            //let t1 = performance.now();
            peaks.points.add(annotation);
            //let t2 = performance.now();
            //console.log("   points.add: " + (t2-t1));


        });
        appContainer.on("drawSession", function (event, sessionListEntry) {

            // tempo curve calculated on the fly
            let tempoAnnotations = [];
            let previousAnnotation = {};

            for (let j = 0; j < sessionListEntry.session.annotations.length; j++) {
                let annotation = sessionListEntry.session.annotations[j];

                // console.log(annotation);

                if (j > 0 && annotation.type === "Tap" && (
                    annotation.subdivision === null || annotation.subdivision === 1 || annotation.subdivision === 0
                )) {
                    let deltaTime = annotation.time - previousAnnotation.time;
                    // console.log(deltaTime);
                    let tempoAnnotation = new Annotation(
                        {
                            type: "Tempo",
                            time: annotation.time,
                            doubleValue: 60.0 / deltaTime,
                            color: annotation.color
                        }
                    );

                    tempoAnnotations.push(tempoAnnotation);
                }
                let point = annotation.getPeaksPoint();
                //let t3 = performance.now();
                peaks.points.add(point);
                //let t4 = performance.now();
                // console.log("drawAnnotation in " + (t4 - t3));

                previousAnnotation = annotation;
            }


            // maybe return reference to layer per session for reuse

            // draw tempogram

            // check existing
            tempoAnnotationSessions = [];
            tempoAnnotationSessions.push({
                sessionListEntry: sessionListEntry,
                annotations: tempoAnnotations
            });
            renderTempoCurves();




        });
        appContainer.on("clearAllAnnotations", function (event) {
            peaks.points.removeAll();
            tempoAnnotationSessions = [];
        });

        appContainer.on("eraseAnnotation", function (event, annotation) {
            peaks.points.removeById(annotation.id);
        });


        appContainer.on("toggleMetronome", function (event) {
            metronomeEnabled = !metronomeEnabled;
        });



        window.onresize = function(event) {
            // console.log("window size changed:");
            // console.log(peaks.views._overview._width);
            width = peaks.views._overview._width;
            height = peaks.views._overview._height;

            console.log(height + " x " + width);

        };

    });


    $: {
        width;
        console.log("width changed:");
        console.log(width);
    }


    const zeroPad = (num, places) => String(num).padStart(places, '0');

    function secondsToMMSS(time) {
        let minutes = Math.floor(time / 60);
        let seconds = zeroPad((time % 60).toFixed(2), 2);
        return `${minutes}:${seconds}`;
    }

    let chart;
    function renderTempoCurves() {

        let maxDuration = peaks.player.getDuration();

        if (typeof (chart) !== "undefined") {
            chart.destroy();
        }


        // let overview = document.getElementById(`overview-container_${recordingId}`);
        // let canvas = overview.lastChild.lastChild;
        // console.log(canvas);

        var ctx = document.getElementById(`tempo-chart-overview_${recordingId}`);



        for (let i = 0; i < tempoAnnotationSessions.length; i++) {

            let chartData = [
                {
                    x: 0.0,
                    y: 0.0
                }
            ];

            let color = tempoAnnotationSessions[i].annotations[0].color;
            // console.log(color);

            tempoAnnotationSessions[i].annotations.map(function (val) {
                chartData.push({
                    x: val.time * 1000, // to milliseconds
                    y: val.doubleValue.toFixed(2)
                });
            });

            chartData.push({
                x: maxDuration * 1000, // to milliseconds
                y: 0.0
            });

            // console.log(chartData);

            chart = new Chart(ctx, {
                type: "line",
                data: {
                    datasets: [
                        {
                            label: "Beats per Minute",
                            /*backgroundColor: color,*/
                            borderColor: color,
                            display: false,
                            data: chartData,
                            pointStyle: "line"
                        }
                    ]
                },

                options: {
                    title: {
                        display: false
                    },
                    scales: {
                        xAxes: [{
                            type: 'time',
                            time: {
                                unit: "millisecond",
                                stepSize: 1000,
                                tooltipFormat: "[Time: ]m:ss.SSS" // https://www.tutorialspoint.com/momentjs/momentjs_format.htm
                            },
                            distribution: "linear",
                            scaleLabel: {
                                display: false,
                                // labelString: 'Time'
                            },
                            display: false,

                        }],
                        yAxes: [{
                            scaleLabel: {
                                display: false,
                                labelString: 'BPM'
                            },
                            display: false
                        }]
                    },
                }


            });




        }


    }



</script>


<style>

    .tempo-container {
        /*border: 1px solid red;*/
        /*height: 158px;*/
        /*background: #b3a3a3;*/
    }

</style>


<div id="zoomview-container_{recordingId}"/>

<div id="overview-container_{recordingId}"/>

<div id="tempo-container_{recordingId}" class="tempo-container">

    <!--<canvas id="tempo-chart-zoomview_{recordingId}" width="{width}" height="79"></canvas>-->

    <canvas id="tempo-chart-overview_{recordingId}" width="{width}" height="158"></canvas>

</div>


