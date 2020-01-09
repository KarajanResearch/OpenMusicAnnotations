package org.karajanresearch.oma.music

/**
 * aka Work
 */
class AbstractMusic {

    String title

    static belongsTo = [composer: Composer]

    static constraints = {
        title nullable: false
        composer nullable: false
    }


    String toString() {
        return composer.toString() + ": " + title
    }
}
