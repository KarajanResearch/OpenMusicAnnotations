package org.karajanresearch.oma.music

import grails.converters.JSON
import org.karajanresearch.oma.annotation.Annotation
import org.karajanresearch.oma.annotation.Session
import org.karajanresearch.oma.api.AnnotationApiService

import static org.springframework.http.HttpStatus.*
import grails.plugin.springsecurity.annotation.Secured


@Secured("ROLE_ADMIN")
class RecordingController {

    static scaffold = Recording


    def recordingService
    def tappingService

    /**
     * called from recording.show view
     * @return
     */
    def ajaxUploadTapData() {

        println params

        def recording = Recording.get(params.recording)
        def sessionName = "ajaxUploadTapData at " + new Date().toString()
        def session = new Session(recording: recording, title: sessionName)

        params["tapList"].tokenize(";").each { tapTime ->
            Double t = Double.parseDouble(tapTime)

            def a = new Annotation(type: "Tap", momentOfPerception: t, session: session)
            session.addToAnnotations(a)

        }


        if (!session.save(flush: true)) {
            println session.errors
        }



        def result = [success: "Alright"]
        render result as JSON


    }

    /**
     * called from sheetMusicPlayer
     * @return
     */
    def ajaxResetSheetMusicPageSelection() {


        def recording = Recording.get(params.recording)
        if (!recording) {
            result = [error: "No recording"]
            render result as JSON
            return
        }

        recording.abstractMusicPart.pdfPageChangeAnnotationSession.delete()

        def result = [success: "Alright"]
        render result as JSON

    }

    /**
     * called from sheetMusicPlayer
     * @return
     */
    def ajaxUploadSheetMusicPageSelection() {
        println "ajaxUploadSheetMusicPageSelection"
        println params

        Double t = Double.parseDouble(params.playheadLocation)
        Integer pageNumber = Integer.parseInt(params.pageNumber)

        def recording = Recording.get(params.recording)
        if (!recording) {
            result = [error: "No recording"]
        }

        def session = recording.abstractMusicPart.pdfPageChangeAnnotationSession

        if (!recording.abstractMusicPart.pdfPageChangeAnnotationSession) {
            recording.abstractMusicPart.pdfPageChangeAnnotationSession = new Session(
                title: "Page change annotations",
                recording: recording,
                annotations: []
            ).save()
        }

        if (!recording.abstractMusicPart.pdfPageChangeAnnotationSession.annotations) {
            println "no anno"
            //def result = [error: "no annotations"]
            //render result as JSON
            //return
        }

        def a = Annotation.findOrSaveWhere(type: "PdfPageChangeEvent",
            intValue: pageNumber,
            session: recording.abstractMusicPart.pdfPageChangeAnnotationSession
        )
        a.momentOfPerception = t

        if (!a.save()) {
            println "a.errors"
            println a.errors
        }

        println(a)

        if (!a) {
            println "no a"
        }

        if (!recording.abstractMusicPart.pdfPageChangeAnnotationSession.annotations.contains(a)) {
            recording.abstractMusicPart.pdfPageChangeAnnotationSession.addToAnnotations(a)
        }
        recording.abstractMusicPart.pdfPageChangeAnnotationSession.save()


        if (!recording.abstractMusicPart.save(flush: true)) {
            println recording.abstractMusicPart.errors
        }


        def result = [success: "Alright"]
        render result as JSON
    }


    def show(Long id) {
        def recording = Recording.get(id)

        def annotationSessions = Session.findAllByRecording(recording)

        JSON.use("deep")
        def annotationSessionsJson = annotationSessions as JSON


        def model = [recording: recording, annotationSessionsJson: annotationSessionsJson]

        //render model as JSON

        render view: "show", model: model
    }

    def vizPlay(Long id) {
        def recording = Recording.get(id)

        def annotationSessions = Session.findAllByRecording(recording)

        JSON.use("deep")
        def annotationSessionsJson = annotationSessions as JSON


        def model = [recording: recording, annotationSessionsJson: annotationSessionsJson]

        //render model as JSON

        render view: "vizPlay", model: model
    }


    def uploadAudio(Recording recording) {
        respond(recording, view: "uploadAudio")
    }

    def uploadTapping(Recording recording) {
        respond(recording, view: "uploadTapping")
    }

    /**
     * fills JS search
     * @return searchBase
     */
    def getSearchBase() {
        def searchBase = []

        Recording.findAllByDigitalAudioIsNotEmpty().each {recording ->
            searchBase.add(
                [
                    id: recording.id,
                    name: recording.toString()
                ]
            )
        }
        //println searchBase
        render searchBase as JSON
    }

/*
    def stream(Long id) {

        def recording = Recording.get(id)

        if (!recording) return

        def file = recordingService.getFile(recording)

        if (!file) return

        response.setContentType("APPLICATION/OCTET-STREAM")
        response.setHeader("Content-Disposition", "Attachment;Filename=\"${f.name}\"")

        def outputStream = response.getOutputStream()
        outputStream << file.newInputStream()
        outputStream.flush()
        outputStream.close()
    }
*/

    def getAudioFile(Long id) {


        def recording = Recording.get(id)

        if (!recording) return notFound()

        def file = recordingService.getFile(recording)

        if (!file) return notFound()


        response.setContentType("APPLICATION/OCTET-STREAM")
        response.setHeader("Content-Disposition", "Attachment;Filename=\"oma-recording-${recording.id}\"")

        def outputStream = response.getOutputStream()
        outputStream << file.newInputStream()
        outputStream.flush()
        outputStream.close()

    }



    def uploadRecordingFile(RecordingFileCommand cmd) {


        Recording recording = Recording.get(cmd.recordingId)
        if (!recording) return notFound()

        recording = recordingService.uploadFile(recording, cmd)

        flash.message = "Audio uploaded"
        redirect(controllerName: "recording", action: "show", id: recording.id)
    }


    def uploadTappingFile(TappingFileCommand cmd) {


        Recording recording = Recording.get(cmd.recordingId)
        if (!recording) return notFound()

        recording = tappingService.uploadFile(recording, cmd)

        flash.message = "Tapping uploaded"
        redirect(controllerName: "recording", action: "show", id: recording.id)
    }


    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'recording.label', default: 'Recording'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }




    /*

    RecordingService recordingService

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond recordingService.list(params), model:[recordingCount: recordingService.count()]
    }

    def show(Long id) {
        respond recordingService.get(id)
    }

    def create() {
        respond new Recording(params)
    }

    def save(Recording recording) {
        if (recording == null) {
            notFound()
            return
        }

        try {
            recordingService.save(recording)
        } catch (ValidationException e) {
            respond recording.errors, view:'create'
            return
        }

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.created.message', args: [message(code: 'recording.label', default: 'Recording'), recording.id])
                redirect recording
            }
            '*' { respond recording, [status: CREATED] }
        }
    }

    def edit(Long id) {
        respond recordingService.get(id)
    }

    def update(Recording recording) {
        if (recording == null) {
            notFound()
            return
        }

        try {
            recordingService.save(recording)
        } catch (ValidationException e) {
            respond recording.errors, view:'edit'
            return
        }

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'recording.label', default: 'Recording'), recording.id])
                redirect recording
            }
            '*'{ respond recording, [status: OK] }
        }
    }

    def delete(Long id) {
        if (id == null) {
            notFound()
            return
        }

        recordingService.delete(id)

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'recording.label', default: 'Recording'), id])
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }
    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'recording.label', default: 'Recording'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }*/
}
