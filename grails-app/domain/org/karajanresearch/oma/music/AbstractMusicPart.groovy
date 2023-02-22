package org.karajanresearch.oma.music

import org.karajanresearch.oma.annotation.Session

/**
 * the sheet music representation of the interpretation
 */
class AbstractMusicPart  {


    Boolean isAuthored

    /**
     * parts can have optional names
     */
    String title

    /**
     * where is the part taken from
     */
    AbstractMusic abstractMusic

    /**
     * file url of the sheet pdf // TODO: support multiple different files
     */
    String pdfLocation

    Session pdfPageChangeAnnotationSession

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
    Interpretation interpretation

    /**
     * in which order is it used. total order per interpretation
     */
    Long interpretationOrder

    static constraints = {
        title nullable: true
        abstractMusic nullable: false
        pdfLocation nullable: true
        interpretationOrder nullable: true
        interpretation nullable: false
        barNumberOffset nullable: true
        numberOfBars nullable: true
        pdfPageChangeAnnotationSession nullable: true
        isAuthored nullable: true
    }

    String toString() {
        if (abstractMusic && title) {
            return abstractMusic.toString() + ": " + title
        }
        if (abstractMusic && !title) {
            return abstractMusic.toString()
        }
        if (!abstractMusic) {
            return title
        }
    }

}
