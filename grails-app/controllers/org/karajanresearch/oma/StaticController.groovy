package org.karajanresearch.oma

import grails.plugin.springsecurity.annotation.Secured


class StaticController {

    @Secured('permitAll')
    def conference2019() {

        render view: "conference2019"

    }
}
