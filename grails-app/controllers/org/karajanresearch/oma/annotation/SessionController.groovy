package org.karajanresearch.oma.annotation

import grails.converters.JSON
import grails.gorm.multitenancy.WithoutTenant
import grails.plugin.springsecurity.annotation.Secured
import grails.validation.ValidationException
import org.karajanresearch.oma.music.AbstractMusicPart
import org.karajanresearch.oma.music.Recording

import static org.springframework.http.HttpStatus.*

@Secured(["ROLE_AUTHENTICATED"])
class SessionController {

    static scaffold = Session

    def springSecurityService

    @WithoutTenant
    def show(Long id) {
        // careful! manual tenancy

        println springSecurityService.principal.id

        // try private session
        Session session = Session.findByIdAndTenantId(id, springSecurityService.principal.id)

        if (!session) {
            // try shared session
            session = Session.FindByIdAndIsShared(id, true)
            if (!session) return notFound()
        }

        def isMine = (session.tenantId == springSecurityService.principal.id)

        render (view: "show", model: [session: session, isMine: isMine ])
    }

    def share(Long id) {
        Session session = Session.get(id)
        if (!session) return notFound()

        session.isShared = true
        if (!session.save(flush: true)) {
            println session.errors
            flash.message = session.errors
        }

        redirect(action: "show", id: session.id)
    }
    def unshare(Long id) {
        Session session = Session.get(id)
        if (!session) return notFound()

        session.isShared = false
        if (!session.save(flush: true)) {
            println session.errors
            flash.message = session.errors
        }

        redirect(action: "show", id: session.id)
    }

    def delete(Long id) {
        if (id == null) {
            //notFound()
            return
        }

        Session s = Session.get(id)
        if (!s) return

        if (!s.delete(flush: true)) {
            println "not deleted"
            println s.errors

        }

        Recording r = s.recording


        redirect(controller: "recording", action: "show", id: r.id)
    }

    /**
     * filling data table with annotations of given session
     * @return
     */
    def ajaxGetAnnotations() {
        println "ajaxGetAnnotations"
        println params

        if (params.session == "null" || params.session == "-1") {
            render ([error: "no session"]) as JSON
            return
        }

        Session session = Session.get(params.session)
        if (!session) {
            render ([error: "no session found"]) as JSON
            return
        }

        render session.annotations as JSON
    }


    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'session.label', default: 'Session'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }

/*
    SessionService sessionService

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond sessionService.list(params), model:[sessionCount: sessionService.count()]
    }

    def show(Long id) {
        respond sessionService.get(id)
    }

    def create() {
        respond new Session(params)
    }

    def save(Session session) {
        if (session == null) {
            notFound()
            return
        }

        try {
            sessionService.save(session)
        } catch (ValidationException e) {
            respond session.errors, view:'create'
            return
        }

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.created.message', args: [message(code: 'session.label', default: 'Session'), session.id])
                redirect session
            }
            '*' { respond session, [status: CREATED] }
        }
    }

    def edit(Long id) {
        respond sessionService.get(id)
    }

    def update(Session session) {
        if (session == null) {
            notFound()
            return
        }

        try {
            sessionService.save(session)
        } catch (ValidationException e) {
            respond session.errors, view:'edit'
            return
        }

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'session.label', default: 'Session'), session.id])
                redirect session
            }
            '*'{ respond session, [status: OK] }
        }
    }

    def delete(Long id) {
        if (id == null) {
            notFound()
            return
        }

        sessionService.delete(id)

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'session.label', default: 'Session'), id])
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }
    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'session.label', default: 'Session'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }
    */

}
