package oma

import grails.gorm.transactions.Transactional

@Transactional
class SheetMusicService {

    def lookupRecording() {

        return "this is the sheet music representation"
    }
}
