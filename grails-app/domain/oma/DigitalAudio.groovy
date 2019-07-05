package oma

class DigitalAudio {

    /**
     * url, where the oma server can access the digital audio file
     */
    String location

    /**
     * file belongs to a specific recording
     */
    static belongsTo = [recording: Recording]

    static constraints = {
        location nullable: false
        recording nullable: true
    }

    String toString() {
        return location
    }
}
