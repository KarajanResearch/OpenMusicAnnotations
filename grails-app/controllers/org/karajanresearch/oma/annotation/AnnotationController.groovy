package org.karajanresearch.oma.annotation

import grails.converters.JSON
import grails.plugin.springsecurity.annotation.Secured
import grails.validation.ValidationException
import static org.springframework.http.HttpStatus.*

@Secured(["ROLE_ADMIN"])
class AnnotationController {

    static scaffold = Annotation


    /**
     * changed accidential 4/4 to 2/4 time signature
     * @return
     */
    @Deprecated
    def quickFix() {

        return

        //Session session = Session.get(14)

        session.annotations.each { Annotation annotation ->

            def newBeat = 0
            def newBar = 0

            if (annotation.beatNumber <= 2) {
                newBar = (annotation.barNumber * 2) - 1
                newBeat = annotation.beatNumber

            } else {
                newBar = annotation.barNumber * 2
                newBeat = annotation.beatNumber - 2
            }

            annotation.beatNumber = newBeat
            annotation.barNumber = newBar

            annotation.save()

        }
        session.save(flush: true)

    }


    /**
     * updating moment of perception from svelte UI
     */
    @Secured(["ROLE_AUTHENTICATED"])
    def ajaxUpdateAnnotationTime() {

        Annotation annotation = Annotation.get(request.JSON.annotationId)
        def result
        if (!annotation) {
            result = [error: "invalid annotation"]
            render result as JSON
            return
        }

        if (annotation.session.id != request.JSON.sessionId) {
            result = [error: "assertion error: annotation not part of session"]
            render result as JSON
            return
        }

        annotation.momentOfPerception = request.JSON.momentOfPerception

        if (!annotation.save(flush: true)) {
            result = [error: "cannot save momentOfPerception of annotation"]
        } else {
            result = [success: "saved annotation"]
        }
        render result as JSON
    }

    /*

    AnnotationService annotationService

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond annotationService.list(params), model:[annotationCount: annotationService.count()]
    }

    def show(Long id) {
        respond annotationService.get(id)
    }

    def create() {
        respond new Annotation(params)
    }

    def save(Annotation annotation) {
        if (annotation == null) {
            notFound()
            return
        }

        try {
            annotationService.save(annotation)
        } catch (ValidationException e) {
            respond annotation.errors, view:'create'
            return
        }

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.created.message', args: [message(code: 'annotation.label', default: 'Annotation'), annotation.id])
                redirect annotation
            }
            '*' { respond annotation, [status: CREATED] }
        }
    }

    def edit(Long id) {
        respond annotationService.get(id)
    }

    def update(Annotation annotation) {
        if (annotation == null) {
            notFound()
            return
        }

        try {
            annotationService.save(annotation)
        } catch (ValidationException e) {
            respond annotation.errors, view:'edit'
            return
        }

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'annotation.label', default: 'Annotation'), annotation.id])
                redirect annotation
            }
            '*'{ respond annotation, [status: OK] }
        }
    }

    def delete(Long id) {
        if (id == null) {
            notFound()
            return
        }

        annotationService.delete(id)

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'annotation.label', default: 'Annotation'), id])
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }
    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'annotation.label', default: 'Annotation'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }

    */
}
