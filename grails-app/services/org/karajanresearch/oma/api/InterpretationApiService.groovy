package org.karajanresearch.oma.api

import grails.gorm.transactions.Transactional
import org.karajanresearch.oma.music.AbstractMusic
import org.karajanresearch.oma.music.AbstractMusicPart
import org.karajanresearch.oma.music.Composer
import org.karajanresearch.oma.music.Interpretation

@Transactional
class InterpretationApiService {

    @Transactional
    def addInterpretation(params) {
        def i = Interpretation.findOrSaveWhere(title: params.title)
        return i
    }


    def addAbstractMusicPart(params) {

        def c = AbstractMusic.get(params["composition"])
        def i = Interpretation.get(params["interpretation"])

        Double numBars
        try {
            numBars = Double.parseDouble(params["number_of_bars"])
        } catch(Exception ex) {
            println ex
            numBars = 0.0
        }

        Double barOffset
        try {
            barOffset = Double.parseDouble(params["bar_number_offset"])
        } catch(Exception ex) {
            println ex
            barOffset = 0.0
        }

        Long partNo
        try {
            partNo = Long.parseLong(params["movement"])
        } catch(Exception ex) {
            println ex
            partNo = 0.0
        }


        def p = AbstractMusicPart.findOrSaveWhere(
            title: params["title"],
            abstractMusic: c,
            interpretation: i,
            interpretationOrder: partNo,
            barNumberOffset: barOffset,
            numberOfBars: numBars
        )


        return p
    }


}
