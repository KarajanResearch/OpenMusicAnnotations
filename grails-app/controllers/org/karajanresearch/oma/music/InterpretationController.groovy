package org.karajanresearch.oma.music

import grails.converters.JSON
import grails.plugin.springsecurity.annotation.Secured
import org.karajanresearch.oma.music.Interpretation

@Secured(["ROLE_AUTHENTICATED"])
class InterpretationController {

    static scaffold = Interpretation


    def ajaxIndex() {

        println "ajaxIndex"

        def namedParams = [:]
        def options  = [:]

        def interpretations = Interpretation.executeQuery("""
            select i.id, i.title, amp.title, am.title, c.name
            from Interpretation i
            left join i.abstractMusicParts as amp
            left join amp.abstractMusic as am
            left join am.composer as c
            
            """, namedParams, options
        ).collect { r ->

            return [
                id                  :  r[0],
                title               :  r[1],
                abstractMusicPartTitle            :  r[2],
                abstractMusicTitle             :  r[3],
                composerName        : r[4]
            ]
        }

        render interpretations as JSON

    }


    def removeComposition() {

        println "removeComposition"
        println params

        if (!params.interpretationId || !params.abstractMusicPartId) {
            return notFound()
        }

        def interpretation = Interpretation.get(params.interpretationId)
        def abstractMusicPart = AbstractMusicPart.get(params.abstractMusicPartId)

        println interpretation
        println abstractMusicPart

        if (!interpretation || !abstractMusicPart) {
            return notFound()
        }

        interpretation.removeFromAbstractMusicParts(abstractMusicPart)
        abstractMusicPart.delete()

        if (!interpretation.save(flush: true)) {
            println interpretation.errors
        }

        redirect(action: "show", id: interpretation.id)

    }


    def update() {

        println "Interpretation.update"
        println params

        def interpretation = Interpretation.get(params.id)

        if (interpretation == null) {
            notFound()
            return
        }

        try {

            interpretation.title = params.title
            def composition =
                AbstractMusic.get(params.compositionId)

            //interpretation.abstractMusicParts


            // TODO: fix double parts for interpretation


            def part = AbstractMusicPart.findOrSaveWhere(
                abstractMusic:  composition,
                title: params.abstractMusicPart,
                interpretation: interpretation
            )

            interpretation.addToAbstractMusicParts(part)





            // interpretation.abstractMusicParts[0].findOrSaveWhere(abstractMusic: composition, title: "new Title")

            // TODO: save from params

            if (!interpretation.save(flush: true)) {
                println interpretation.errors
            }


        } catch (Exception e) {
            println e
            respond interpretation.errors, view:'edit'
            return
        }

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'interpretation.label', default: 'Interpretation'), interpretation.id])
                redirect interpretation
            }
            '*'{ respond interpretation, [status: OK] }
        }
    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'interpretation.label', default: 'Interpretation'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: 404 }
        }
    }


    /*

    InterpretationService interpretationService

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond interpretationService.list(params), model:[interpretationCount: interpretationService.count()]
    }

    def show(Long id) {
        respond interpretationService.get(id)
    }

    def create() {
        respond new Interpretation(params)
    }

    def save(Interpretation interpretation) {
        if (interpretation == null) {
            notFound()
            return
        }

        try {
            interpretationService.save(interpretation)
        } catch (ValidationException e) {
            respond interpretation.errors, view:'create'
            return
        }

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.created.message', args: [message(code: 'interpretation.label', default: 'Interpretation'), interpretation.id])
                redirect interpretation
            }
            '*' { respond interpretation, [status: CREATED] }
        }
    }

    def edit(Long id) {
        respond interpretationService.get(id)
    }

    def update(Interpretation interpretation) {
        if (interpretation == null) {
            notFound()
            return
        }

        try {
            interpretationService.save(interpretation)
        } catch (ValidationException e) {
            respond interpretation.errors, view:'edit'
            return
        }

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'interpretation.label', default: 'Interpretation'), interpretation.id])
                redirect interpretation
            }
            '*'{ respond interpretation, [status: OK] }
        }
    }

    def delete(Long id) {
        if (id == null) {
            notFound()
            return
        }

        interpretationService.delete(id)

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'interpretation.label', default: 'Interpretation'), id])
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }
    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'interpretation.label', default: 'Interpretation'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }*/
}
