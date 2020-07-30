package org.karajanresearch.oma.annotation

import grails.gorm.MultiTenant
import org.karajanresearch.oma.music.Recording

/**
 * groups Annotations, e.g., upload, one listening, one range of perception, anything that draws a meaningful plane in the
 * annotation vector room.
 * If we need a more general term than session, then refactor parent Group abstraction
 */
class Session implements MultiTenant<Session> {
    /**
     * the tenantId is the id (Long) of the currently logged in user
     */
    Long tenantId

    /**
     * annotations always relate to actual audible content and the time line within.
     * in other words: no annotation can be added to interpretations without recording
     */
    static belongsTo = [recording: Recording]
    //Recording recording

    /**
     * bi-directional link to annotations
     */
    SortedSet annotations
    static hasMany = [annotations: Annotation]


    /**
     * usually auto generated describing where session object is created. Introduce session factory, if
     * code gets crowded.
     */
    String title


    /**
     * defines an optional temporal range for the range of perception TODO: remove
     */
    //Date startTimestamp
    //Date endTimestamp

    static constraints = {
        title nullable: false
        recording nullable: false
        //startTimestamp nullable: true
        //endTimestamp nullable: true
    }

    String toString() {
        return title
    }
}
