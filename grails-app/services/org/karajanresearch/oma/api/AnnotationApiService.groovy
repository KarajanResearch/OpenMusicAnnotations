package org.karajanresearch.oma.api

// import grails.gorm.transactions.Transactional
import org.karajanresearch.oma.annotation.Annotation
import org.karajanresearch.oma.annotation.Session
import org.karajanresearch.oma.music.Recording
import org.karajanresearch.oma.music.RecordingFileCommand
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
        return Session.get(params.session)
    }

    def findByRecording(params) {

        def r = Recording.get(params.recording)

        def result = []


        r.annotationSessions.each {Session session ->

            result.addAll(session.annotations.collect{ Annotation annotation ->
                [
                    type: annotation.type,
                    annotationId: annotation.id,
                    recordingId: annotation.session.recording.id,
                    barNumber: annotation.barNumber,
                    beatNumber: annotation.beatNumber,
                    intValue: annotation.intValue,
                    subDivision: annotation.subdivision,
                    annotationSession: annotation.session.id,
                    momentOfPerception: annotation.momentOfPerception
                ]
            })

        }

        return  result


    }


}
