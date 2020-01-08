package org.karajanresearch.oma.music

import grails.plugin.springsecurity.annotation.Secured
import org.karajanresearch.oma.music.Composer

@Secured(["ROLE_ADMIN"])
class ComposerController {

    static scaffold = Composer

    /*

    ComposerService composerService

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond composerService.list(params), model:[composerCount: composerService.count()]
    }

    def show(Long id) {
        respond composerService.get(id)
    }

    def create() {
        respond new Composer(params)
    }

    def save(Composer composer) {
        if (composer == null) {
            notFound()
            return
        }

        try {
            composerService.save(composer)
        } catch (ValidationException e) {
            respond composer.errors, view:'create'
            return
        }

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.created.message', args: [message(code: 'composer.label', default: 'Composer'), composer.id])
                redirect composer
            }
            '*' { respond composer, [status: CREATED] }
        }
    }

    def edit(Long id) {
        respond composerService.get(id)
    }

    def update(Composer composer) {
        if (composer == null) {
            notFound()
            return
        }

        try {
            composerService.save(composer)
        } catch (ValidationException e) {
            respond composer.errors, view:'edit'
            return
        }

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'composer.label', default: 'Composer'), composer.id])
                redirect composer
            }
            '*'{ respond composer, [status: OK] }
        }
    }

    def delete(Long id) {
        if (id == null) {
            notFound()
            return
        }

        composerService.delete(id)

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'composer.label', default: 'Composer'), id])
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }
    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'composer.label', default: 'Composer'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }
    */
}
