package oma.annotation

import oma.Recording

class Annotation {



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
     * TODO: define annotation hierarchy or document based duck-typing?
     */

    static constraints = {
        session nullable: false
        type nullable: false
        momentOfPerception nullable: false
    }
}
