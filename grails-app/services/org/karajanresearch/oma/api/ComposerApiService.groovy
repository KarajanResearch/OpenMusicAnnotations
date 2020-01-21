package org.karajanresearch.oma.api

import grails.gorm.transactions.Transactional
import groovy.transform.CompileStatic
import org.karajanresearch.oma.music.AbstractMusic
import org.karajanresearch.oma.music.Composer
import org.karajanresearch.oma.music.ComposerDataService

class ComposerApiService {

    ComposerDataService composerDataService

    @Transactional
    def addComposer(params) {

        //def c = Composer.findOrSaveWhere(name: params.name)

        def c = composerDataService.find(params.name)
        if (!c) c = new Composer(name: params.name).save()

        return c
    }

    @Transactional
    def addComposition(params) {
        def c = Composer.get(params.composer)
        def comp = AbstractMusic.findOrSaveWhere(composer: c, title: params.title)
        return comp
    }


    def listComposer(params) {
        return Composer.list(params)
    }

    def findByName(params) {
        return Composer.findByName(params.name)
    }

    def findCompositionByComposer(params) {
        return AbstractMusic.findAllByComposer(Composer.get(params.composer))
    }

}
