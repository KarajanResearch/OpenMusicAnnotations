package oma.annotation


class Annotation implements Comparable {



    /**
     * Annotations are grouped. many tappings in one go, session, listening
     * Session: range of perception
     */

    static belongsTo = [session: Session]

    /**
     * Every annotation belongs to a certain perception of a certain event (e.g., perceiving a cadence)
     */
    double momentOfPerception

    /**
     * type of the event
     */
    String type

    /**
     * For example. the third eighth note in bar 20 has: 20, 3, 8
     * Note that this bars are not necessarily related to bars of existing scores,
     * but rather a "virtual score" that describes the recording
     */
    Long barNumber
    Long beatNumber
    Long subdivision

    // TODO: in audio-viz, drag and drop beat annotations to the score to map time



    /**
     * TODO: define annotation hierarchy or document based duck-typing?
     */

    static constraints = {
        session nullable: false
        type nullable: false
        momentOfPerception nullable: false
        barNumber nullable: true
        beatNumber nullable: true
        subdivision nullable: true
    }


    int compareTo(obj) {
        Annotation other = (Annotation)obj
        momentOfPerception.compareTo(other.momentOfPerception)
    }

    String toString() {
        return "${type}: beat ${beatNumber} at bar ${barNumber} at ${momentOfPerception}"
    }
}
