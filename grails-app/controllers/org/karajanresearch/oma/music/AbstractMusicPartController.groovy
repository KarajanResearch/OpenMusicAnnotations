package org.karajanresearch.oma.music


import grails.plugin.springsecurity.annotation.Secured

import static org.springframework.http.HttpStatus.*

@Secured(["ROLE_ADMIN"])
class AbstractMusicPartController {

    static scaffold = AbstractMusicPart

    AbstractMusicPartService abstractMusicPartService


    def upload(AbstractMusicPart abstractMusicPart) {

        respond(abstractMusicPart, view: "uploadSheet")

    }


    def uploadScoreFile(AbstractMusicPartScoreFileCommand cmd) {




        AbstractMusicPart abstractMusicPart = AbstractMusicPart.get(cmd.abstractMusicPartId)
        if (!abstractMusicPart) return notFound()

        abstractMusicPart = abstractMusicPartService.uploadScoreFile(abstractMusicPart, cmd)


        flash.message = "File uploaded"

        //render abstractMusicPart as JSON


        respond (abstractMusicPart, view: "show")
    }

    def getScoreFile(AbstractMusicPart abstractMusicPart) {



        File file = abstractMusicPartService.getScoreFile(abstractMusicPart)
        if (!file) return notFound()

        println "loaded File"

        response.setContentType("APPLICATION/OCTET-STREAM")
        response.setHeader("Content-Disposition", "Attachment;Filename=\"score_${abstractMusicPart.id}.pdf\"")

        def outputStream = response.getOutputStream()
        outputStream << file.newInputStream()
        outputStream.flush()
        outputStream.close()

    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'abstractMusicPart.label', default: 'AbstractMusicPart'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }

    /*

    AbstractMusicPartService abstractMusicPartService

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond abstractMusicPartService.list(params), model:[abstractMusicPartCount: abstractMusicPartService.count()]
    }

    def show(Long id) {
        respond abstractMusicPartService.get(id)
    }

    def create() {
        respond new AbstractMusicPart(params)
    }

    def save(AbstractMusicPart abstractMusicPart) {
        if (abstractMusicPart == null) {
            notFound()
            return
        }

        try {
            abstractMusicPartService.save(abstractMusicPart)
        } catch (ValidationException e) {
            respond abstractMusicPart.errors, view:'create'
            return
        }

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.created.message', args: [message(code: 'abstractMusicPart.label', default: 'AbstractMusicPart'), abstractMusicPart.id])
                redirect abstractMusicPart
            }
            '*' { respond abstractMusicPart, [status: CREATED] }
        }
    }

    def edit(Long id) {
        respond abstractMusicPartService.get(id)
    }

    def update(AbstractMusicPart abstractMusicPart) {
        if (abstractMusicPart == null) {
            notFound()
            return
        }

        try {
            abstractMusicPartService.save(abstractMusicPart)
        } catch (ValidationException e) {
            respond abstractMusicPart.errors, view:'edit'
            return
        }

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'abstractMusicPart.label', default: 'AbstractMusicPart'), abstractMusicPart.id])
                redirect abstractMusicPart
            }
            '*'{ respond abstractMusicPart, [status: OK] }
        }
    }

    def delete(Long id) {
        if (id == null) {
            notFound()
            return
        }

        abstractMusicPartService.delete(id)

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'abstractMusicPart.label', default: 'AbstractMusicPart'), id])
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }
    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'abstractMusicPart.label', default: 'AbstractMusicPart'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }
    */
}
