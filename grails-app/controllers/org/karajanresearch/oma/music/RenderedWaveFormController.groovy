package org.karajanresearch.oma.music

import grails.converters.JSON
import grails.plugin.springsecurity.annotation.Secured
import grails.validation.ValidationException
import static org.springframework.http.HttpStatus.*

@Secured("ROLE_ADMIN")
class RenderedWaveFormController {

    static scaffold = RenderedWaveForm


    def ajaxGetWaveForm() {

        println params

        def recording = Recording.get(Integer.parseInt(params.recording))
        if (!recording) {
            render "no recording"
        }

        def renderedWaveForm = recording.renderedWaveForm

        if (!renderedWaveForm) {
            render "no wave form"
        }

        def images = RenderedImageSample.findAllByRenderedWaveFormAndFromSampleGreaterThanEqualsAndToSampleLessThanEquals(
            renderedWaveForm,
            Integer.parseInt(params.from_sample),
            Integer.parseInt(params.to_sample),
            [sort: "fromSample"]
        )

        render images as JSON

    }


    def getSample() {



    }


    /*

    RenderedWaveFormService renderedWaveFormService

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond renderedWaveFormService.list(params), model:[renderedWaveFormCount: renderedWaveFormService.count()]
    }

    def show(Long id) {
        respond renderedWaveFormService.get(id)
    }

    def create() {
        respond new RenderedWaveForm(params)
    }

    def save(RenderedWaveForm renderedWaveForm) {
        if (renderedWaveForm == null) {
            notFound()
            return
        }

        try {
            renderedWaveFormService.save(renderedWaveForm)
        } catch (ValidationException e) {
            respond renderedWaveForm.errors, view:'create'
            return
        }

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.created.message', args: [message(code: 'renderedWaveForm.label', default: 'RenderedWaveForm'), renderedWaveForm.id])
                redirect renderedWaveForm
            }
            '*' { respond renderedWaveForm, [status: CREATED] }
        }
    }

    def edit(Long id) {
        respond renderedWaveFormService.get(id)
    }

    def update(RenderedWaveForm renderedWaveForm) {
        if (renderedWaveForm == null) {
            notFound()
            return
        }

        try {
            renderedWaveFormService.save(renderedWaveForm)
        } catch (ValidationException e) {
            respond renderedWaveForm.errors, view:'edit'
            return
        }

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'renderedWaveForm.label', default: 'RenderedWaveForm'), renderedWaveForm.id])
                redirect renderedWaveForm
            }
            '*'{ respond renderedWaveForm, [status: OK] }
        }
    }

    def delete(Long id) {
        if (id == null) {
            notFound()
            return
        }

        renderedWaveFormService.delete(id)

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'renderedWaveForm.label', default: 'RenderedWaveForm'), id])
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }
    }


     */

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'renderedWaveForm.label', default: 'RenderedWaveForm'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }
}
