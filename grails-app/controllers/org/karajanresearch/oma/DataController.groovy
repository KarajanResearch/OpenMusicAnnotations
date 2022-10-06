package org.karajanresearch.oma

import grails.converters.JSON
import grails.gorm.multitenancy.WithoutTenant
import grails.plugin.springsecurity.annotation.Secured
import org.karajanresearch.oma.annotation.Annotation
import org.karajanresearch.oma.annotation.Session
import org.karajanresearch.oma.music.Recording

@Secured("permitAll")
class DataController {

    def springSecurityService

    def index(Integer max) {

        render(view: "index", model:[recordingList: []])
    }

    @WithoutTenant
    def ajaxIndex() {

        def result = Recording.executeQuery("""
            select
                recording.id, 
                recording.title, 
                interpretation.title, 
                abstractMusicParts.title,
                composer.name,
                abstractMusic.title
            from Recording recording
            join recording.interpretation interpretation
            join interpretation.abstractMusicParts abstractMusicParts
            join abstractMusicParts.abstractMusic abstractMusic
            join abstractMusic.composer composer
            
        """
        ).collect {

            def compositionTitle = it[5]
            if (it[3]) {
                compositionTitle = compositionTitle + ": " + it[3]
            }

            return [
                id: it[0],
                title: it[1],
                interpretationTitle: it[2],
                abstractMusicTitle: compositionTitle,
                composerName: it[4]
            ]
        }


        render result as JSON


    }


    @WithoutTenant
    def download() {
        println params
        def ids = params.id.tokenize(",")

        List<Long> recordingIds = ids.each {
            return Long.parseLong(it)
        }


        def result = Recording.findAllByIdInList(recordingIds).collect {
            def compositionTitle = it.interpretation.abstractMusicParts[0].abstractMusic.title
            if (it.interpretation.abstractMusicParts[0].title) {
                compositionTitle = compositionTitle + ": " + it.interpretation.abstractMusicParts[0].title
            }

            return [
                id: it.id,
                abstractMusicTitle: compositionTitle,
                composerName: it.interpretation.abstractMusicParts[0].abstractMusic.composer.name,
                interpretationTitle: it.interpretation.title,
                sessions: it.annotationSessions.collect { Session session ->
                    return [
                        title: session.title,
                        annotations: session.annotations.sort{Annotation a -> a.momentOfPerception }.collect { Annotation annotation ->
                            return [
                                type: annotation.annotationType.name,
                                bar: annotation.barNumber,
                                beat: annotation.beatNumber,
                                momentOfPerception: annotation.momentOfPerception
                            ]
                        }
                    ]
                }
            ]
        }

        render result as JSON
    }

}
