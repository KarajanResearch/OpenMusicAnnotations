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
    SessionService sessionService


    def ajaxIndex() {

        def sessionList = []

        render sessionList as JSON

    }


    def show(Long id) {
        // careful! manual tenancy
        Session session = sessionService.get(id)

        if (!session) return notFound()

        def isMine = false

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
    @Deprecated
    def ajaxGetAnnotations() {
        println "ajaxGetAnnotations"
        println params

        if (params.session == "null" || params.session == "-1") {
            render ([error: "no session"]) as JSON
            return
        }

        Session session = sessionService.get(params.session)
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


    /**
     * download session data from session/show
     * @param id
     * @return
     */
    def getJsonFile(Long id) {

        def session = Session.get(id)
        if (!session) return notFound()

        def result = [
            id: session.id,
            title: session.title,
            recordingTitle: session.recording.toString(),
            abstractMusicTitle: session.recording?.interpretation?.abstractMusicParts[0]?.toString(),
            interpretationTitle: session.recording?.interpretation?.toString(),
            annotations: session.annotations
        ]

        render result as JSON
    }


    /**
     * used on SessionList.svelte to update title
     * @param id
     * @param let postData = {
     *          sessionId: sessionId,
     *          title: title
     *         }
     * @return
     */
    def ajaxUpdateTitle() {
        Session session = Session.get(request.JSON.sessionId)
        def result
        if (!session) {
            result = [error: "invalid session"]
            render result as JSON
            return
        }
        session.title = request.JSON.title;

        if (!session.save(flush: true)) {
            result = [error: "cannot save title of annotation session"]
        } else {
            result = [success: "saved title of annotation session"]
        }
        render result as JSON
    }


    /**
     * add session via svelte UI
     * @return
     */
    def ajaxCreateSession() {

        println request.JSON

        def recording = Recording.get(request.JSON.recordingId)
        if (!recording) {
            def result = [error: "no recording"]
            render result as JSON
            return
        }

        def session = new Session(title: request.JSON.title, recording: recording, annotations: [] )

        if (!session) {
            def result = [error: "no session"]
            render result as JSON
            return
        }

        request.JSON.annotations.each {
            sessionService.addUiAnnotationToSession(it, session)
        }

        if (session.save(flush: true)) {
            def result = [success: "session added", session: sessionService.getUiStructure(session)]
            render result as JSON
        } else {
            println session.errors
            def result = [error: "session not created"]
            render result as JSON
        }

    }


    /**
     * deleting sessions via svelte UI
     * @return
     */
    def ajaxDeleteSessions() {
        def result

        request.JSON.deleteSessionIds.each {
            Session.get(it).delete(flush: true)
        }

        result = [success: "sessions deleted"]
        render result as JSON
    }


    /**
     * adding new annotations to existing session via svelteUI
     */
    def ajaxAddToSession() {
        def result
        def session = Session.get(request.JSON.sessionId)
        if (!session) {
            result = [error: "no session found"]
            render result as JSON
            return
        }

        request.JSON.annotations.each {
            sessionService.addUiAnnotationToSession(it, session)
        }

        if (session.save(flush: true)) {
            result = [success: "session updated", session: sessionService.getUiStructure(session)]
            render result as JSON
        } else {
            println session.errors
            result = [error: "session not updated"]
            render result as JSON
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
