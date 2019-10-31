package org.karajanresearch.oma

import grails.plugin.springsecurity.annotation.Secured
import grails.validation.ValidationException
import static org.springframework.http.HttpStatus.*

@Secured(["ROLE_ADMIN"])
class AbstractMusicController {

    static scaffold = AbstractMusic


    /*

    AbstractMusicService abstractMusicService

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond abstractMusicService.list(params), model:[abstractMusicCount: abstractMusicService.count()]
    }

    def show(Long id) {
        respond abstractMusicService.get(id)
    }

    def create() {
        respond new AbstractMusic(params)
    }

    def save(AbstractMusic abstractMusic) {
        if (abstractMusic == null) {
            notFound()
            return
        }

        try {
            abstractMusicService.save(abstractMusic)
        } catch (ValidationException e) {
            respond abstractMusic.errors, view:'create'
            return
        }

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.created.message', args: [message(code: 'abstractMusic.label', default: 'AbstractMusic'), abstractMusic.id])
                redirect abstractMusic
            }
            '*' { respond abstractMusic, [status: CREATED] }
        }
    }

    def edit(Long id) {
        respond abstractMusicService.get(id)
    }

    def update(AbstractMusic abstractMusic) {
        if (abstractMusic == null) {
            notFound()
            return
        }

        try {
            abstractMusicService.save(abstractMusic)
        } catch (ValidationException e) {
            respond abstractMusic.errors, view:'edit'
            return
        }

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'abstractMusic.label', default: 'AbstractMusic'), abstractMusic.id])
                redirect abstractMusic
            }
            '*'{ respond abstractMusic, [status: OK] }
        }
    }

    def delete(Long id) {
        if (id == null) {
            notFound()
            return
        }

        abstractMusicService.delete(id)

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'abstractMusic.label', default: 'AbstractMusic'), id])
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }
    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'abstractMusic.label', default: 'AbstractMusic'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }

    */

}
