package oma

class Recording {

    /**
     * title of the recording
     */
    String title

    /**
     * what was recorded
     */
    static belongsTo = [interpretation: Interpretation]

    /**
     * manifestation of the recording
     */
    DigitalAudio digitalAudio

    static constraints = {
        title nullable: true
        interpretation nullable: false
        digitalAudio nullable: true
    }

    String toString() {
        if (!title) {
            return "Recording of " + interpretation.toString()
        } else {
            return title
        }
    }
}
