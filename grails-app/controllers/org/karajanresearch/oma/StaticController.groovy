package org.karajanresearch.oma

import grails.plugin.springsecurity.annotation.Secured

@Secured('permitAll')

class StaticController {

    def conference2019() {

        render view: "conference2019"

    }

    def fwfproject() {

        render view: "fwfproject"

    }

    def people() {
        render view: "people"
    }

}
