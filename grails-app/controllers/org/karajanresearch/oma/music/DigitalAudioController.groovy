package org.karajanresearch.oma.music


import grails.plugin.springsecurity.annotation.Secured

import static org.springframework.http.HttpStatus.*

@Secured("ROLE_AUTHENTICATED")
class DigitalAudioController {


    static scaffold = DigitalAudio





    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'digitalAudio.label', default: 'DigitalAudio'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }

    /*
    DigitalAudioService digitalAudioService

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond digitalAudioService.list(params), model:[digitalAudioCount: digitalAudioService.count()]
    }

    def show(Long id) {
        respond digitalAudioService.get(id)
    }

    def create() {
        respond new DigitalAudio(params)
    }

    def save(DigitalAudio digitalAudio) {
        if (digitalAudio == null) {
            notFound()
            return
        }

        try {
            digitalAudioService.save(digitalAudio)
        } catch (ValidationException e) {
            respond digitalAudio.errors, view:'create'
            return
        }

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.created.message', args: [message(code: 'digitalAudio.label', default: 'DigitalAudio'), digitalAudio.id])
                redirect digitalAudio
            }
            '*' { respond digitalAudio, [status: CREATED] }
        }
    }

    def edit(Long id) {
        respond digitalAudioService.get(id)
    }

    def update(DigitalAudio digitalAudio) {
        if (digitalAudio == null) {
            notFound()
            return
        }

        try {
            digitalAudioService.save(digitalAudio)
        } catch (ValidationException e) {
            respond digitalAudio.errors, view:'edit'
            return
        }

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'digitalAudio.label', default: 'DigitalAudio'), digitalAudio.id])
                redirect digitalAudio
            }
            '*'{ respond digitalAudio, [status: OK] }
        }
    }

    def delete(Long id) {
        if (id == null) {
            notFound()
            return
        }

        digitalAudioService.delete(id)

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'digitalAudio.label', default: 'DigitalAudio'), id])
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }
    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'digitalAudio.label', default: 'DigitalAudio'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }

     */
}
