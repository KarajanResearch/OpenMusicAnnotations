package org.karajanresearch.oma.music


class Interpretation {

    Boolean isAuthored
    String title

    Date changedAt

    String orchestra
    String conductor
    Integer year


    /**
     * from a single interpretation == performance, one can create many recordings. usually one, though
     * A single interpretation may consist of many different parts of many different pieces
     */
    static hasMany = [recordings: Recording, abstractMusicParts: AbstractMusicPart]

    static constraints = {
        title nullable: false
        changedAt nullable: true
        isAuthored nullable: true
        orchestra nullable: true
        conductor nullable: true
        year nullable: true
    }

    String tokenizeParts() {
        return abstractMusicParts*.toString().toListString()
    }

    String toString() {
        return title // + "(" + tokenizeParts() + ")"
    }
}
