package org.karajanresearch.oma.api

import grails.gorm.transactions.Transactional
import groovy.transform.CompileStatic
import org.karajanresearch.oma.music.AbstractMusic
import org.karajanresearch.oma.music.Composer
import org.karajanresearch.oma.music.ComposerDataService

class ComposerApiService {

    ComposerDataService composerDataService

    /**
     *
     * @param params.name The name of the composer
     * @return composer
     */
    @Transactional
    def addComposer(params) {
        def c = composerDataService.find(params.name)
        if (!c) c = new Composer(name: params.name).save()
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
