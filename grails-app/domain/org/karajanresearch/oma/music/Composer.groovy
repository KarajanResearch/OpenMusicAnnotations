package org.karajanresearch.oma.music

class Composer {


    String name
    String wikipediaEnUrl
    Boolean isAuthored


    static mapping = {
        //tenantId name: "tenant"
    }

    static hasMany = [compositions: AbstractMusic]

    static constraints = {
        name nullable: false
        compositions nullable: true
        wikipediaEnUrl nullable: true
        isAuthored nullable: true
    }

    String toString() {
        return name
    }
}
