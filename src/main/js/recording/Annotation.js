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
                    type = "Tap",
                    annotationId = 0,
                    sessionId = 0,
                    bar = 0,
                    beat = 0,
                    subdivision = 0,
                    stringValue = "",
                    doubleValue = 0.0
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
        this.subdivision = subdivision;
        this.stringValue = stringValue;
        this.doubleValue = doubleValue;

        // create labels based on type
        if (this.type === "Tap") {
            if (this.subdivision > 0) {
                this.labelText = `${bar}:${beat}:${subdivision}`;
            } else {
                this.labelText = `${bar}:${beat}`;
            }
        }
        if (this.type === "Text") {
            console.log("Type Text");
            console.log(this);
            this.labelText = this.stringValue;
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
     * converts a Annotation from middleware to JS-UI representation
     * @param annotation
     * @param color
     * @returns {Annotation}
     */
    static fromGormAnnotation(annotation, color) {

        let a = new Annotation({
            id: `${annotation.sessionId}:${annotation.id}`,
            time: annotation.momentOfPerception,
            editable: annotation.isMine,
            bar: annotation.bar,
            beat: annotation.beat,
            subdivision: annotation.subdivision,
            stringValue: annotation.stringValue,
            type: annotation.type,
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

    /**
     * update in database
     */
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
                subdivision: this.subdivision,
                stringValue: this.stringValue,
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
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    }

    /**
     * remove from data base
     */
    delete() {

        if (this.isCurrentlyNew()) {
            //handle that, if necessary
        } else {
            let data = {
                sessionId: this.sessionId,
                annotationId: this.annotationId
            };

            fetch('/annotation/ajaxDelete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }

    }



}