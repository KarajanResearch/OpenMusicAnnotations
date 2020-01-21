package org.karajanresearch.oma.music

import grails.gorm.MultiTenant
import org.karajanresearch.oma.Role
import org.karajanresearch.oma.User
import org.karajanresearch.oma.annotation.Session

/**
 * the sheet music representation of the interpretation
 */
class AbstractMusicPart implements MultiTenant<AbstractMusicPart> {
    /**
     * the tenantId is the id (Long) of the currently logged in user
     */
    Long tenantId

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
        interpretationOrder nullable: false
        interpretation nullable: false
        barNumberOffset nullable: false
        numberOfBars nullable: false
        pdfPageChangeAnnotationSession nullable: true
    }

    String toString() {

        return abstractMusic.toString() + ", starting at bar " + sprintf("%.0f", barNumberOffset != null ? barNumberOffset : 1.0 ) + ", " + getTitle()
    }

    String getTitle() {
        if (!title) {
            return "Part " + interpretationOrder + " of " + interpretation.toString()
        } else {
            return title
        }
    }
}