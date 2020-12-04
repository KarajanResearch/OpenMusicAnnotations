/**
 * UI Representation of an Annotation and conversion to peaks.points
 */

export default class Annotation {

    constructor(id, time, editable, labelText, color) {
        this.id = id;
        this.time = time;
        this.editable = editable;
        this.labelText = labelText;
        this.color = color;
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
        return new Annotation(point.id, point.time, point.editable, point.labelText, point.color);
    }

}