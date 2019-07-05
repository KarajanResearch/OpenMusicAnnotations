package oma

import grails.validation.ValidationException
import static org.springframework.http.HttpStatus.*

class RecordingController {

    static scaffold = Recording

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
