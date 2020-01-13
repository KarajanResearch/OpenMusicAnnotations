package org.karajanresearch.oma.music

import grails.gorm.MultiTenant
import org.karajanresearch.oma.Role
import org.karajanresearch.oma.User

class Interpretation implements MultiTenant<Interpretation> {
    /**
     * the tenantId is the id (Long) of the currently logged in user
     */
    Long tenantId


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
