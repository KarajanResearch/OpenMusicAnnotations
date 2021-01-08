<script>
    import { onMount } from "svelte";
    import Peaks from 'peaks.js';
    import Chart from "chart.js";
    import Annotation from "./Annotation";
    import CustomPointMarker from "./CustomPointMarker";
    import SimplePointMarker from "./SimplePointMarker";
    import NullPointMarker from "./NullPointMarker";

    // id of the grails recording object passed from the outside
    export let recordingId;

    const appContainer = window.$("#RecordingUiContainer-" + recordingId);
    const clickPlayer = document.getElementById("click-sound-" + recordingId);

    let metronomeEnabled = true;
    let peaks = {};


    let width = 1400;
    let height = 200;

    // let tempoAnnotationSessions = [];

    let overview;
    let zoomview;


    let tempoChartDatasets;




    /**
     * overrides point markers for peaks.js
     * @param options see peaks.js manual
     * // https://github.com/joeweiss/peaks.js/blob/master/demo/custom-markers.html
     * @returns {*}
     */
    function createPointMarker(options) {
        // console.log(options);
        if (options.view === 'zoomview') {
            return new CustomPointMarker(options, zoomview, overview);
            //return new SimplePointMarker(options, zoomview, overview);
        }
        else {

            // filter offbeats and subdivisions
            let p = options.point;
            if (p.type === "Tap" && p.beat === 1) {
                // none or only first subdivisions
                if (p.subdivision === null || p.subdivision === 0 || p.subdivision === 1) {
                    return new SimplePointMarker(options, zoomview, overview);
                }
            } else if (p.type === "Text") {
                return new SimplePointMarker(options, zoomview, overview);
            }


            return new NullPointMarker(options);
        }
    }


    onMount(async () => {

        overview = document.getElementById('overview-container_'+recordingId);
        zoomview= document.getElementById('zoomview-container_'+recordingId);

        tempoChartDatasets = new Map();


        // https://github.com/bbc/peaks.js#configuration
        const options = {
            containers: {
                overview: overview,
                zoomview: zoomview
            },
            mediaElement: document.getElementById('audio_element_' + recordingId),
            dataUri: {
                json: '/recording/getPeaksFile/' + recordingId
            },
            height: 290,
            zoomLevels: [32, 64, 128, 256, 512, 1024, 2048, 4096],
            emitCueEvents: true, /* https://github.com/bbc/peaks.js#events */
            // Color for the zoomable waveform
            zoomWaveformColor: 'rgba(0,150,0,1)',
            // Color for the overview waveform
            overviewWaveformColor: 'rgba(0, 225, 128, 1)',
            // Color for the overview waveform rectangle
            // that shows what the zoomable view shows
            overviewHighlightColor: 'rgb(200,42,0)',

            // Color of the play head text
            playheadTextColor: '#555555',
            showPlayheadTime: true,
            axisLabelColor: "#333333",

            // the color of a point marker
            // pointMarkerColor: '#CCCCCC',

            keyboard: true,
            // Keyboard nudge increment in seconds (left arrow/right arrow)
            // nudgeIncrement: 0.01,

            createPointMarker: createPointMarker

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


            for (let j = 0; j < sessionListEntry.session.annotations.length; j++) {
                let annotation = sessionListEntry.session.annotations[j];
                peaks.points.add(annotation);
            }

            //renderTempoCurves();
        });

        appContainer.on("drawTempoCurve", function (event, sessionListEntry) {

            let maxDuration = peaks.player.getDuration();

            let chartData = [
                {
                    x: 0.0,
                    y: 0.0
                }
            ];

            sessionListEntry.tempoAnnotations.map(function (val) {
                chartData.push({
                    x: val.time * 1000, // to milliseconds
                    y: val.doubleValue.toFixed(2)
                });
            });

            chartData.push({
                x: maxDuration * 1000, // to milliseconds
                y: 0.0
            });

            let dataset = {
                label: sessionListEntry.session.title,
                /*backgroundColor: color,*/
                borderColor: sessionListEntry.color,
                display: false,
                data: chartData,
                pointStyle: "line"
            };

            tempoChartDatasets.set(sessionListEntry.id, dataset);
            drawTempoCurve(sessionListEntry);
        });
        appContainer.on("removeTempoCurve", function (event, sessionListEntry) {
            //drawTempoCurve(sessionListEntry);
            tempoChartDatasets.delete(sessionListEntry.id);
            drawTempoCurve(sessionListEntry);
        });



        appContainer.on("clearAllAnnotations", function (event) {
            peaks.points.removeAll();
            // tempoAnnotationSessions = [];
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
    function drawTempoCurve(sessionListEntry) {


        if (typeof (chart) !== "undefined") {
            chart.destroy();
        }


        // let overview = document.getElementById(`overview-container_${recordingId}`);
        //let canvas = overview.lastChild.lastChild;
        // console.log(canvas);

        let ctx = document.getElementById(`tempo-chart-overview_${recordingId}`);
        //let ctx = canvas;



        let datasets = []

        tempoChartDatasets.forEach( function (value, key) {
            console.log(key);
            console.log(value);
            datasets.push(value);
        });

        chart = new Chart(ctx, {
            type: "line",
            data: {
                datasets: datasets
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


    function tempoChartOverviewClicked(event) {
        console.log(event);



    }



</script>


<style>

    .tempo-container-overview {
        /*border: 2px solid red;*/
        /*height: 158px;*/
        /*background: #b3a3a3;*/
        position: relative;
        top: -21em;
        pointer-events: none;
    }

</style>


<div id="zoomview-container_{recordingId}"/>

<div id="overview-container_{recordingId}"/>


<canvas on:mousedown={tempoChartOverviewClicked} class="tempo-container-overview" id="tempo-chart-overview_{recordingId}" width="{width}" height="158"></canvas>

<!--
<div id="tempo-container_{recordingId}" >

    <canvas class="tempo-container" id="tempo-chart-zoomview_{recordingId}" width="{width}" height="79"></canvas>

</div>
-->

