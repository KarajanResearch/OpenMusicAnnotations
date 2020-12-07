/**
 * UI Representation of an Annotation and conversion to peaks.points
 *
 * effectively, this is an extension of peaks.point
 */

export default class Annotation {

    constructor({
                    id = "",
                    time = 0.0,
                    editable = true,
                    labelText = "",
                    color="0x000000",
                    type = "tap",
                    annotationId = 0,
                    sessionId = 0,
                    bar = 0,
                    beat = 0
                } = {}) {
        this.id = id;
        this.time = time;
        this.editable = editable;
        this.labelText = labelText;
        this.color = color;
        this.type = type;
        this.annotationId = annotationId;
        this.sessionId = sessionId;

        // parsed data
        this.bar = bar;
        this.beat = beat;
        if (this.type === "tap") {
            this.labelText = `${bar}:${beat}`;
        }

        // a reference to an existing peaks point
        this.peaksPoint = {};
        this.annotation = this;
    }

    toString() {
        return `id:${this.id} labelText:${this.labelText} time:${this.time}`;
    }


    /**
     * converts to peaks.point. Currently, it does nothing. Adds everything to peaks point as well
     * peaks format: instance.points.add({ time, editable, color, labelText, id[, ...] })
     * TODO: update once Annotation deviates from Point
     */
    getPeaksPoint() {
        return this;
    }

    /**
     * converts from peaks.point to Annotation. Currently, it dies nothing too.
     * TODO: update once Annotation deviates from Point
     * @param point
     */
    static fromPeaksPoint(point) {

        let peaksPointIdParts = point.id.split(":");

        let sessionId = 0;
        let annotationId = 0;

        if (peaksPointIdParts[0] === "currentlyNew") {
            console.log("creating from currently new peaks point");
        } else {
            sessionId = parseInt(peaksPointIdParts[0]);
            annotationId = parseInt(peaksPointIdParts[1]);
        }

        let annotation = new Annotation({
            id: point.id,
            time: point.time,
            editable: point.editable,
            labelText: point.labelText,
            color: point.color,
            annotationId: annotationId,
            sessionId: sessionId
        });
        annotation.peaksPoint = point;
        return annotation;
    }


    static fromGormAnnotation(annotation, color) {

        let a = new Annotation({
            id: `${annotation.sessionId}:${annotation.id}`,
            time: annotation.momentOfPerception,
            editable: annotation.isMine,
            bar: annotation.bar,
            beat: annotation.beat,
            color: color,
            annotationId: annotation.id,
            sessionId: annotation.sessionId
        });
        return a;
    }


    /**
     * check id to see, of annotation is new, or already part of some session
     */
    isCurrentlyNew() {
        let tempIdParts = this.id.split(":");
        if (tempIdParts[0] === "currentlyNew") {
            return true;
        } else {
            return false;
        }
    }

    save() {

        if (this.isCurrentlyNew()) {
            //handle that, if necessary
        } else {
            let data = {
                sessionId: this.sessionId,
                annotationId: this.annotationId,
                labelText: this.labelText,
                bar: this.bar,
                beat: this.beat,
                momentOfPerception: this.time
            };

            fetch('/annotation/ajaxUpdate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                    // TODO: updateAnnotationInSessionList(sessionId, data.annotation);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    }


    saveTime() {
        // locate annotation and update

        // point ids must be parsed, because they are context sensitive
        // all annotation id's have format: [sessionId | "currentlyNew" ] ":" [annotationId | currentlyNewIndex]
        let tempIdParts = this.id.split(":");

        let sessionId = 0;
        let annotationId = 0;

        if (tempIdParts[0] === "currentlyNew") {
            // case: new annotation in currentlyNewSession

            annotationId = parseInt(tempIdParts[1]);
            // update currentlyNew data structure

            console.log("cannot persist a currently new annotation");

            // TODO: currentlyNewSession[annotationId].time = point.time;

        } else {
            // case: existing annotation in existing session

            sessionId = parseInt(tempIdParts[0]);
            annotationId = parseInt(tempIdParts[1]);

            let data = {
                sessionId: sessionId,
                momentOfPerception: this.time,
                annotationId: annotationId
            };

            fetch('/annotation/ajaxUpdateMomentOfPerception', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                    // TODO: updateAnnotationInSessionList(sessionId, data.annotation);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });

        }

    }


}