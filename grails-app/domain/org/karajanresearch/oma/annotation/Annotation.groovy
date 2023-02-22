package org.karajanresearch.oma.annotation

/**
 * representation of what is perceived in music.
 *
 * has a moment of perception
 * has a type
 * has a value
 */
class Annotation implements Comparable {


    /**
     * Annotations are grouped. many tappings in one go, session, listening
     * Session: range of perception
     */

    static belongsTo = [session: Session]

    /**
     * Every annotation belongs to a certain perception of a certain event (e.g., perceiving a cadence) in seconds
     */
    double momentOfPerception

    @Deprecated
    String type

    /**
     * type of the event
     */
    AnnotationType annotationType

    /**
     * actual representation of an annotation. annotationType determines semantics of value fields
     */
    Integer intValue
    Double doubleValue
    String stringValue


    /**
     * fixed field semantics for bars and beats to organize music over time
     *
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
        type nullable: true
        annotationType nullable: false
        momentOfPerception nullable: false
        barNumber nullable: true
        beatNumber nullable: true
        subdivision nullable: true
        intValue nullable: true
        doubleValue nullable: true
        stringValue nullable: true
    }


    int compareTo(obj) {
        Annotation other = (Annotation)obj
        momentOfPerception.compareTo(other.momentOfPerception)
    }

    @Deprecated
    String toString() {
        switch (annotationType.name) {
            case "PdfPageChangeEvent":
                return "${annotationType.name}: page ${intValue} at at ${momentOfPerception}"
            break
            default:
                return "${annotationType.name}: beat ${beatNumber} at bar ${barNumber} at ${momentOfPerception}"
        }

    }
}
