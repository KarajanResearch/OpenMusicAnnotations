package org.karajanresearch.oma

class DigitalAudio {

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
        return location
    }
}
