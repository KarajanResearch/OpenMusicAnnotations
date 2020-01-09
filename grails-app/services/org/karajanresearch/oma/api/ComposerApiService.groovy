package org.karajanresearch.oma.api

import grails.gorm.transactions.Transactional
import org.karajanresearch.oma.music.AbstractMusic
import org.karajanresearch.oma.music.Composer

class ComposerApiService {

    @Transactional
    def addComposer(params) {

        def c = Composer.findOrSaveWhere(name: params.name)

        return c
    }

    @Transactional
    def addComposition(params) {
        def c = Composer.get(params.composer)
        def comp = AbstractMusic.findOrSaveWhere(composer: c, title: params.title)
        return comp
    }
}
