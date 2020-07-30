package org.karajanresearch.oma.api

import grails.gorm.transactions.Transactional
import org.karajanresearch.oma.music.AbstractMusicPart
import org.karajanresearch.oma.music.Interpretation
import org.karajanresearch.oma.music.Recording

import org.springframework.web.multipart.MultipartFile

@Transactional
class ScoreApiService {


    def recordingService

    def addScore(params) {


        Interpretation i = Interpretation.get(params.interpretation)
        AbstractMusicPart a = AbstractMusicPart.get(params.abstract_music_part)

        Recording exists = Recording.findByTitleAndInterpretationAndAbstractMusicPart(
            params.title, i, a
        )

        if (exists) return exists

        if (!params.file) {
            return ["error": "please provide a file"]
        }
        MultipartFile f = params.file
        println f.originalFilename

        def r = new Recording(
            title: params.title,
            interpretation: i,
            abstractMusicPart: a
        ).save(flush: true)
/*
        RecordingFileCommand cmd = new RecordingFileCommand(
            version: 1,
            recordingId: r.id,
            recordingFile: f
        )

        r = recordingService.uploadFile(r, cmd)
*/
        return r
    }
}
