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
    static belongsTo = [interpretation: Interpretation]

    AbstractMusicPart abstractMusicPart

    /**
     * manifestation of the recording
     */
    static hasMany = [digitalAudio: DigitalAudio]

    static constraints = {
        //id nullable: false
        title nullable: false
        digitalAudio nullable: true
        interpretation nullable: false
    }

    String toString() {
        //if (!title) {
            return title + ": Recording of " + interpretation.toString() + ": " + abstractMusicPart.toString()
        //} else {
        //    return title
        //}
    }
}
