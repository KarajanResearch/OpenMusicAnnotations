package oma

class Recording {

    //Long id

    /**
     * title of the recording
     */
    String title

    /**
     * what was recorded
     */
    static belongsTo = [interpretation: Interpretation, abstractMusicPart: AbstractMusicPart]

    /**
     * manifestation of the recording
     */
    DigitalAudio digitalAudio

    static constraints = {
        //id nullable: false
        title nullable: false
        digitalAudio nullable: true
        interpretation nullable: false
    }

    String toString() {
        //if (!title) {
            return title + ": Recording of " + abstractMusicPart.toString()
        //} else {
        //    return title
        //}
    }
}
