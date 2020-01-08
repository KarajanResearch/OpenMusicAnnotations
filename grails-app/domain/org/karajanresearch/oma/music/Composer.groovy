package org.karajanresearch.oma.music

import org.karajanresearch.oma.music.AbstractMusic

class Composer {

    String name

    static hasMany = [compositions: AbstractMusic]

    static constraints = {
        name nullable: false
        compositions nullable: true
    }

    String toString() {
        return name
    }
}
