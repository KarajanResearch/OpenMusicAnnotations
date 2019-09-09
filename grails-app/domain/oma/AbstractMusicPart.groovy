package oma

class AbstractMusicPart {

    /**
     * parts can have optional names
     */
    String title

    /**
     * where is the part taken from
     */
    AbstractMusic abstractMusic

    /**
     * at what bar does it start (if available)
     * It is a double value to support crazy in between stuff, e.g., AbstractMusic can be something else
     * than sheet music. The value of barNumber
     */
    Double barNumberOffset

    /**
     * the duration of the part in number of bars. It is a double value to support crazy in between stuff.
     * A negative or zero value denotes "the rest of the piece", i.e., <= 0.0
     */
    Double numberOfBars

    /**
     * in which interpretation is that particular part used
     */
    static belongsTo = [interpretation: Interpretation]
    /**
     * in which order is it used. total order per interpretation
     */
    Long interpretationOrder

    static constraints = {
        title nullable: true
        abstractMusic nullable: false
        interpretationOrder nullable: false
        interpretation nullable: false
        barNumberOffset nullable: false
        numberOfBars nullable: false
    }

    String toString() {
        return interpretation.toString() + " pt. " + interpretationOrder.toString() + ", " + getTitle() + ", " + abstractMusic.toString() + ", starting at bar " + sprintf("%.2f", barNumberOffset != null ? barNumberOffset : 1.0 )
    }

    String getTitle() {
        if (!title) {
            return "Part " + interpretationOrder + " of " + interpretation.toString()
        } else {
            return title
        }
    }
}
