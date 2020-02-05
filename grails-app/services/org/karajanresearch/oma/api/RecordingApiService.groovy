package org.karajanresearch.oma.api

import grails.gorm.transactions.Transactional

import org.karajanresearch.oma.annotation.Annotation
import org.karajanresearch.oma.music.AbstractMusicPart
import org.karajanresearch.oma.music.DigitalAudio
import org.karajanresearch.oma.music.Interpretation
import org.karajanresearch.oma.music.Recording
import org.karajanresearch.oma.music.RecordingFileCommand
import org.karajanresearch.oma.music.RecordingService
import org.springframework.web.multipart.MultipartFile

@Transactional
class RecordingApiService {

    RecordingService recordingService

    def annotationWindow(Annotation from, Annotation to) {

        def windowStart = from.momentOfPerception
        def windowEnd = to.momentOfPerception

        println "Cutting audio " + windowStart + " to " + windowEnd


    }




    def addRecording(params) {


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

        RecordingFileCommand cmd = new RecordingFileCommand(
            version: 1,
            recordingId: r.id,
            recordingFile: f
        )

        r = recordingService.uploadFile(r, cmd)

        return r
    }

    def getRecording(params) {
        return Recording.get(params.recording)
    }


    def getRecordingAudio(params) {

        def recording = Recording.get(params.recording)

        return recordingService.getFile(recording)


    }
}
