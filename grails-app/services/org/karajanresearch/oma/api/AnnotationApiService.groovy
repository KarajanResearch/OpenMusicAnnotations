package org.karajanresearch.oma.api

// import grails.gorm.transactions.Transactional
import org.karajanresearch.oma.annotation.Annotation
import org.karajanresearch.oma.annotation.Session
import org.karajanresearch.oma.music.Recording

import org.karajanresearch.oma.music.TappingFileCommand
import org.karajanresearch.oma.music.TappingService
import org.springframework.web.multipart.MultipartFile

// @Transactional
class AnnotationApiService {

    /**
     *
     * @param params
     * @param params.annotationId the id of an existing annotation object. Returns a single annotation object
     * @return
     */
    def get(params) {

        if (params.annotationId) {
            return Annotation.get(params.annotationId)
        }

        // returns a sorted Set of annotations for some session
        return Session.findByTitleIsNotNull().annotations
    }


    TappingService tappingService
    def addSession(params) {

        Recording recording = Recording.get(params.recording)
        if (!recording) {
            return ["error": "No Recording for id: " + params.recording]
        }


        MultipartFile f = params.file
        println f.originalFilename



        TappingFileCommand cmd = new TappingFileCommand(
            version: 1,
            recordingId: recording.id,
            tappingFile: f
        )

        return tappingService.uploadFile(recording, cmd)

        //return []
    }


    def getSession(params) {
        def session = Session.get(params.session)
        if (!session) return []
        return [
            id: session.id,
            title: session.title,
            annotations: session.annotations.collect { Annotation a ->
                return [
                    id: a.id,
                    momentOfPerception: a.momentOfPerception,
                    barNumber: a.barNumber,
                    beatNumber: a.beatNumber
                ]
            }
        ]
    }

    /**
     * all annotations for a given recording
     * @param params
     * @return
     */
    def findByRecording(params) {

        def r = Recording.get(params.recording)
        if (!r) return null

        def result = []

        return r.annotationSessions.collect {session ->
            return [
                id: session.id,
                title: session.title,
                recording: [id: session.recording.id, title: session.recording.title]
            ]
        }
    }


}
