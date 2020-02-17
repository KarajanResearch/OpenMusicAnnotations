package org.karajanresearch.oma.music

import grails.plugin.springsecurity.annotation.Secured
import grails.validation.ValidationException
import org.karajanresearch.oma.api.RenderedImageApiService

import static org.springframework.http.HttpStatus.*

@Secured("ROLE_ADMIN")
class RenderedImageSampleController {

    static scaffold = RenderedImageSample


    RenderedImageApiService renderedImageApiService


    def getImage(Long id) {
        println "getImage"
        println params

        def sample = RenderedImageSample.get(id)
        if (!sample) return notFound()

        def file = renderedImageApiService.getFile(sample)
        if (!file) return notFound()

        response.setContentType("APPLICATION/OCTET-STREAM")
        response.setHeader("Content-Disposition", "inline;Filename=\"${sample.id}.png\"")
        response.setHeader("Content-Transfer-Encoding", "binary")
        response.setHeader("Content-Length", file.size().toString())


        def outputStream = response.getOutputStream()
        outputStream << file.newInputStream()
        outputStream.flush()
        outputStream.close()
    }


    /*
    RenderedImageSampleService renderedImageSampleService

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond renderedImageSampleService.list(params), model:[renderedImageSampleCount: renderedImageSampleService.count()]
    }

    def show(Long id) {
        respond renderedImageSampleService.get(id)
    }

    def create() {
        respond new RenderedImageSample(params)
    }

    def save(RenderedImageSample renderedImageSample) {
        if (renderedImageSample == null) {
            notFound()
            return
        }

        try {
            renderedImageSampleService.save(renderedImageSample)
        } catch (ValidationException e) {
            respond renderedImageSample.errors, view:'create'
            return
        }

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.created.message', args: [message(code: 'renderedImageSample.label', default: 'RenderedImageSample'), renderedImageSample.id])
                redirect renderedImageSample
            }
            '*' { respond renderedImageSample, [status: CREATED] }
        }
    }

    def edit(Long id) {
        respond renderedImageSampleService.get(id)
    }

    def update(RenderedImageSample renderedImageSample) {
        if (renderedImageSample == null) {
            notFound()
            return
        }

        try {
            renderedImageSampleService.save(renderedImageSample)
        } catch (ValidationException e) {
            respond renderedImageSample.errors, view:'edit'
            return
        }

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'renderedImageSample.label', default: 'RenderedImageSample'), renderedImageSample.id])
                redirect renderedImageSample
            }
            '*'{ respond renderedImageSample, [status: OK] }
        }
    }

    def delete(Long id) {
        if (id == null) {
            notFound()
            return
        }

        renderedImageSampleService.delete(id)

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'renderedImageSample.label', default: 'RenderedImageSample'), id])
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }
    }



     */
    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'renderedImageSample.label', default: 'RenderedImageSample'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }
}
