package org.karajanresearch.oma.music

class DigitalAudio {

    /**
     * used for updates from user, in case the name is the same as an existing one
     */
    String originalFileName


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
        originalFileName nullable: false
        location nullable: false
        contentType nullable: false
        recording nullable: true
    }

    String toString() {
        def pathParts = location.split("/")
        return pathParts[pathParts.length - 1]
    }
}
