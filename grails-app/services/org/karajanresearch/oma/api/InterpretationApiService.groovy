package org.karajanresearch.oma.api

import grails.gorm.transactions.Transactional
import org.karajanresearch.oma.music.AbstractMusic
import org.karajanresearch.oma.music.AbstractMusicPart
import org.karajanresearch.oma.music.AbstractMusicPartScoreFileCommand
import org.karajanresearch.oma.music.AbstractMusicPartService
import org.karajanresearch.oma.music.Composer
import org.karajanresearch.oma.music.Interpretation
import org.karajanresearch.oma.music.Recording
import org.springframework.web.multipart.MultipartFile

@Transactional
class InterpretationApiService {

    AbstractMusicPartService abstractMusicPartService

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

        def p = AbstractMusicPart.findWhere(
            title: params["title"],
            abstractMusic: c,
            interpretation: i,
            interpretationOrder: partNo,
            barNumberOffset: barOffset,
            numberOfBars: numBars
        )

        if (p) {
            if (p.pdfLocation) {
                println "exists"
                return p
            }
        } else {
            p = new AbstractMusicPart(
                title: params["title"],
                abstractMusic: c,
                interpretation: i,
                interpretationOrder: partNo,
                barNumberOffset: barOffset,
                numberOfBars: numBars
            )
            if (!p.save(flush: true)) {
                println p.errors
                return [error: p.errors]
            }
        }

        if (!params.file) {
            return ["error": "please provide a file"]
        }
        MultipartFile f = params.file
        println f.originalFilename

        AbstractMusicPartScoreFileCommand cmd = new AbstractMusicPartScoreFileCommand(
            version: 1,
            abstractMusicPartId: p.id,
            scoreFile: f
        )

        return abstractMusicPartService.uploadScoreFile(p, cmd)
    }

    def findByComposition(params) {

        def c = AbstractMusic.get(params["composition"])

        return AbstractMusicPart.findAllByAbstractMusic(c).collect {
            [
                interpretation: it.interpretation.toString(),
                recordingId: it.interpretation.recordings[0].id,
            ]
        }



    }


}
