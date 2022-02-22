package org.karajanresearch.oma.music

import grails.gorm.MultiTenant
import org.karajanresearch.oma.Role
import org.karajanresearch.oma.User

/**
 * aka Work
 */
class AbstractMusic implements MultiTenant<AbstractMusic> {
    /**
     * the tenantId is the id (Long) of the currently logged in user
     */
    Long tenantId

    String title

    static belongsTo = [composer: Composer]

    static constraints = {
        title nullable: false
        composer nullable: true
    }


    String toString() {
        // return composer.toString() + ": " + title
        return title
    }
}
