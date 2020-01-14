package org.karajanresearch.oma.music

import grails.gorm.MultiTenant
import org.karajanresearch.oma.Role
import org.karajanresearch.oma.User

class DigitalAudio implements MultiTenant<DigitalAudio> {
    /**
     * the tenantId is the id (Long) of the currently logged in user
     */
    Long tenantId


    /**
     * url, where the org.karajanresearch.oma server can access the digital audio file
     */
    String location
    String contentType


    /**
     * file belongs to a specific recording
     */
    static belongsTo = [recording: Recording]

    static constraints = {
        location nullable: false
        contentType nullable: false
        recording nullable: true
    }

    String toString() {
        def pathParts = location.split("/")
        return pathParts[pathParts.length - 1]
    }
}
