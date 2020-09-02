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
            def composition = AbstractMusic.get(params.compositionId)

            def part = AbstractMusicPart.findOrSaveWhere(
                abstractMusic:  composition,
                title: params.abstractMusicPart
            )


            if (!interpretation.abstractMusicParts.contains(part)) {
                interpretation.abstractMusicParts.add(part)
            }




            // interpretation.abstractMusicParts[0].findOrSaveWhere(abstractMusic: composition, title: "new Title")

            // TODO: save from params

            if (!interpretation.save(flush: true)) {
                println interpretation.errors
            }


        } catch (Exception e) {
            println e.message
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
            '*'{ render status: NOT_FOUND }
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
