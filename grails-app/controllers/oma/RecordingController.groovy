package oma

import grails.converters.JSON
import grails.validation.ValidationException
import oma.annotation.Annotation
import oma.annotation.Session

import static org.springframework.http.HttpStatus.*

class RecordingController {

    static scaffold = Recording


    def recordingService

    /**
     * called from recording.show view
     * @return
     */
    def ajaxUploadTapData() {

        println params

        def recording = Recording.get(params.recording)
        def sessionName = "Saved at " + new Date().toString()
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


    def show(Long id) {
        def recording = Recording.get(id)

        def annotationSessions = Session.findAllByRecording(recording)

        JSON.use("deep")
        def annotationSessionsJson = annotationSessions as JSON


        def model = [recording: recording, annotationSessionsJson: annotationSessionsJson]

        //render model as JSON

        render view: "show", model: model
    }


    def upload(Recording recording) {

        respond(recording, view: "uploadAudio")

    }


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


    def uploadRecordingFile(RecordingFileCommand cmd) {




        Recording recording = Recording.get(cmd.recordingId)
        if (!recording) return null

        recording = recordingService.uploadFile(recording, cmd)



        flash.message = "File uploaded"

        render recording as JSON


        //render (model: recording, view: "show")
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
