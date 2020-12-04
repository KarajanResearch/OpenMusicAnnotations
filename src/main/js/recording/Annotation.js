/**
 * UI Representation of an Annotation and conversion to peaks.points
 */

export default class Annotation {

    constructor({id = "", time = 0.0, editable = true, labelText = "", color="0x000000", kapiId = 0} = {}) {
        this.id = id;
        this.time = time;
        this.editable = editable;
        this.labelText = labelText;
        this.color = color;
        this.kapiId = kapiId;
    }

    toString() {
        return `id:${this.id} labelText:${this.labelText} time:${this.time}`;
    }


    /**
     * converts to peaks.point. Currently, it does nothing
     * peaks format: instance.points.add({ time, editable, color, labelText, id[, ...] })
     * TODO: update once Annotation deviates from Point
     */
    peaksPoint() {
        return this;
    }

    /**
     * converts from peaks.point to Annotation. Currently, it dies nothing too.
     * TODO: update once Annotation deviates from Point
     * @param point
     */
    static fromPeaksPoint(point) {
        return new Annotation({
            id: point.id,
            time: point.time,
            editable: point.editable,
            labelText: point.labelText,
            color: point.color
        });
    }

}