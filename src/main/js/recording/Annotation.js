/**
 * UI Representation of an Annotation
 */

export default class Annotation {

    /*
    let annotation = {
                time: playerPosition,
                editable: true,
                labelText: "" + barNumber + ":" + currentBeat,
                color: "#000000",
                id: "" // will be added later, but create field already to support JIT-Compiler
            };
     */

    constructor(id, time, editable, labelText, color) {
        this.id = id;
        this.time = time;
        this.editable = editable;
        this.labelText = labelText;
        this.color = color;
    }


    /**
     * converts to peaks.point. Currently, it does nothing
     * peaks format: instance.points.add({ time, editable, color, labelText, id[, ...] })
     */
    peaksPoint() {

        // console.log(this);

        return this;
    }

}