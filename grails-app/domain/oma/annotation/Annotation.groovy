package oma.annotation

import oma.Recording

class Annotation {

    /**
     * annotations always relate to actual audible content and the time line within.
     * in other words: no annotation can be added to interpretations without recording
     */
    /**
     * Annotations may be grouped. many tappings in one go, session, listening, range of perception
     */

    static belongsTo = [recording: Recording, session: Session]

    /**
     * Every annotation belongs to a certain perception of a certain event (e.g., perceiving a cadence)
     */
    double momentOfPerception



    /**
     * TODO: define annotation hierarchy or document based duck-typing?
     */

    static constraints = {
        recording nullable: false
        momentOfPerception nullable: false
    }
}
