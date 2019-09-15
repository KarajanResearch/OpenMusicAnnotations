package org.karajanresearch.oma

class Interpretation {

    String title


    /**
     * from a single interpretation == performance, one can create many recordings. usually one, though
     * A single interpretation may consist of many different parts of many different pieces
     */
    static hasMany = [recordings: Recording, abstractMusicParts: AbstractMusicPart]

    static constraints = {
        title nullable: false
    }

    String tokenizeParts() {
        return abstractMusicParts*.toString().toListString()
    }

    String toString() {
        return title // + "(" + tokenizeParts() + ")"
    }
}
