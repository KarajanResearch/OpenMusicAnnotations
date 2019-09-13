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
     */
    Long barNumber
    Long beatNumber
    Long subdivision



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
}
