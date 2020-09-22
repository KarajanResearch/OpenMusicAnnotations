package org.karajanresearch.oma.music

import grails.gorm.MultiTenant
import org.karajanresearch.oma.Role
import org.karajanresearch.oma.User
import org.karajanresearch.oma.annotation.Session

class Recording implements MultiTenant<Recording> {
    /**
     * the tenantId is the id (Long) of the currently logged in user
     */
    Long tenantId


    //Long id

    /**
     * title of the recording
     */
    String title


    /**
     * unstructured meta data for later normalization
     *
     * example: recordingData.year = 1978
     */
    Map recordingData = [:]

    /**
     * what was recorded
     */
    Interpretation interpretation

    /**
     * the computed, final, actually used annotation session for beats and bars
     */
    Session beats
    Session tempo


    /**
     * manifestation of the recording and annotation sessions
     */
    static hasMany = [digitalAudio: DigitalAudio, annotationSessions: Session]

    /**
     * may be shared with the public
     */
    Boolean isShared

    static constraints = {
        title nullable: false
        digitalAudio nullable: true
        interpretation nullable: true
        beats nullable: true
        tempo nullable: true
        isShared nullable: true
    }

    String toString() {
        //if (!title) {
            return title + ": Recording of " + interpretation.toString()
        //} else {
        //    return title
        //}
    }
}
