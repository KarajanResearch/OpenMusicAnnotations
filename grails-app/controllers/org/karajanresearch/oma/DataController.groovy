package org.karajanresearch.oma

import grails.converters.JSON
import grails.gorm.multitenancy.WithoutTenant
import grails.plugin.springsecurity.annotation.Secured
import org.karajanresearch.oma.music.Recording

@Secured("permitAll")
class DataController {

    def springSecurityService

    def index(Integer max) {

        render(view: "index", model:[recordingList: []])
    }

    @WithoutTenant
    def ajaxIndex() {


        def recordingList = Recording.list().collect {

            // println it

            return [
                id: it.id,
                // TODO: more readable data checks
                composerName: it.interpretation?.abstractMusicParts ? it.interpretation?.abstractMusicParts[0]?.abstractMusic?.composer?.toString() : null,
                abstractMusicTitle: it.interpretation?.abstractMusicParts ? it.interpretation?.abstractMusicParts[0]?.toString() : null,
                interpretationTitle: it.interpretation?.toString(),
                title: it.title
            ]
        }

        render recordingList as JSON


    }
}
