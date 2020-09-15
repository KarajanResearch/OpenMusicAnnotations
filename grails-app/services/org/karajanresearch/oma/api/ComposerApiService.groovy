package org.karajanresearch.oma.api

import grails.converters.JSON
import grails.gorm.transactions.Transactional
import grails.util.Environment
import groovy.json.JsonSlurper
import groovy.transform.CompileStatic
import org.karajanresearch.oma.music.AbstractMusic
import org.karajanresearch.oma.music.Composer
import org.karajanresearch.oma.music.ComposerDataService

class ComposerApiService {

    ComposerDataService composerDataService

    def grailsApplication

    def getWikipediaComposerList() {

        def path = ""
        switch (Environment.current) {
            case Environment.DEVELOPMENT:
                path = grailsApplication.config.getProperty("oma.dataDirectory.development")
                break
            case Environment.PRODUCTION:
                path = grailsApplication.config.getProperty("oma.dataDirectory.production")
                break
        }

        def jsonFilePath = path + "/bootstrap/composerList.json"
        def slurper = new JsonSlurper()

        def list = slurper.parse(new File(jsonFilePath).newInputStream())

        return list

    }


    /**
     *
     * @param params.name The name of the composer
     * @return composer
     */
    @Transactional
    def addComposer(params) {
        def c = composerDataService.find(params.name)

        // try wikipedia list
        def wikiList = getWikipediaComposerList()
        def wikiComposer = wikiList.find {
            it.name == params.name
        }

        println "Found: " + wikiComposer

        if (!c) c = new Composer(name: params.name, wikipediaEnUrl: wikiComposer?.href).save()
        return c
    }

    /**
     *
     * @param params.title The title of the composition
     * @param params.composer The id of an existing composer
     * @return composition
     */
    @Transactional
    def addComposition(params) {
        def c = Composer.get(params.composer)
        def comp = AbstractMusic.findOrSaveWhere(composer: c, title: params.title)
        return comp
    }


    def listComposer(params) {
        return Composer.list(params).collect {
            [
                composerId: it.id,
                name: it.name
            ]
        }
    }


    def getComposer(params) {

        def c = Composer.get(params.composer)
        return [
            id: c.id,
            name: c.name
        ]

    }


    def findByName(params) {
        return Composer.findByName(params.name).collect {
            [
                composerId: it.id,
                name: it.name,
                compositions: it.compositions.collect { c ->
                    [
                        compositionId: c.id,
                        compositionTitle: c.title
                    ]
                }
            ]
        }
    }

    def findCompositionByComposer(params) {
        return AbstractMusic.findAllByComposer(Composer.get(params.composer)).collect { c ->
            [
                compositionId: c.id,
                compositionTitle: c.title,
                composerId: c.composer.id
            ]
        }
    }

}
