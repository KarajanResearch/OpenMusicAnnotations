package oma

class Annotation {

    /**
     * annotations always relate to actual audible content and the time line within.
     * in other words: no annotation can be added to interpretations without recording
     */
    static belongsTo = [recording: Recording]

    /**
     * TODO: define annotation hierarchy or document based duck-typing?
     */

    static constraints = {
    }
}
