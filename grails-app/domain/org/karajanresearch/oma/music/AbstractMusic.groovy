package org.karajanresearch.oma.music


/**
 * aka Work
 */
class AbstractMusic {


    String title
    String subTitle
    Boolean isAuthored

    static belongsTo = [composer: Composer]

    static constraints = {
        title nullable: false
        composer nullable: true
        subTitle nullable: true
        isAuthored nullable: true
    }


    String toString() {
        return composer.toString() + ": " + title + (subTitle? ": " + subTitle : "")
        //return title
    }
}
