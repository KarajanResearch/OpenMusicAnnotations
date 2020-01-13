package org.karajanresearch.oma.music

import grails.gorm.MultiTenant
import org.karajanresearch.oma.User


class Composer implements MultiTenant<Composer> {
    /**
     * the tenantId is the id (Long) of the currently logged in user
     */
    Long tenantId

    String name


    static mapping = {
        //tenantId name: "tenant"
    }

    static hasMany = [compositions: AbstractMusic]

    static constraints = {
        name nullable: false
        compositions nullable: true
    }

    String toString() {
        return name
    }
}
