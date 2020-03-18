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

    /**
     * abstract music (sheet) that represents that recording.
     * deprecated. use abstractmusicpart in interpretations
     */
    @Deprecated
    AbstractMusicPart abstractMusicPart

    /**
     * the computed, final, actually used annotation session for beats and bars
     */
    Session beats
    Session tempo


    /**
     * reference to pre-rendered wav forms
     */
    @Deprecated // use recordingData.peaksFile instead
    RenderedWaveForm renderedWaveForm


    /**
     * manifestation of the recording and annotation sessions
     */
    static hasMany = [digitalAudio: DigitalAudio, annotationSessions: Session]

    static constraints = {
        title nullable: false
        digitalAudio nullable: true
        interpretation nullable: false
        beats nullable: true
        tempo nullable: true
        renderedWaveForm nullable: true
    }

    String toString() {
        //if (!title) {
            return title + ": Recording of " + interpretation.toString() + ": " + abstractMusicPart?.toString()
        //} else {
        //    return title
        //}
    }
}
