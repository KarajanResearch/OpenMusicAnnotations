package org.karajanresearch.oma

import grails.plugin.springsecurity.annotation.Secured
import grails.validation.ValidationException
import static org.springframework.http.HttpStatus.*

class AuthenticationTokenController {

    static scaffold = AuthenticationToken


    @Secured(["ROLE_AUTHENTICATED"])
    def show(Long id) {
        respond AuthenticationToken.get(id)
    }

    @Secured(["ROLE_AUTHENTICATED"])
    def delete(Long id) {
        def token = AuthenticationToken.get(id)
        token.delete(flush: true)

        flash.message = 'Token deleted'
        redirect controller: 'user', action: 'show'
    }



    /*
    AuthenticationTokenService authenticationTokenService

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond authenticationTokenService.list(params), model:[authenticationTokenCount: authenticationTokenService.count()]
    }

    def show(Long id) {
        respond authenticationTokenService.get(id)
    }

    def create() {
        respond new AuthenticationToken(params)
    }

    def save(AuthenticationToken authenticationToken) {
        if (authenticationToken == null) {
            notFound()
            return
        }

        try {
            authenticationTokenService.save(authenticationToken)
        } catch (ValidationException e) {
            respond authenticationToken.errors, view:'create'
            return
        }

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.created.message', args: [message(code: 'authenticationToken.label', default: 'AuthenticationToken'), authenticationToken.id])
                redirect authenticationToken
            }
            '*' { respond authenticationToken, [status: CREATED] }
        }
    }

    def edit(Long id) {
        respond authenticationTokenService.get(id)
    }

    def update(AuthenticationToken authenticationToken) {
        if (authenticationToken == null) {
            notFound()
            return
        }

        try {
            authenticationTokenService.save(authenticationToken)
        } catch (ValidationException e) {
            respond authenticationToken.errors, view:'edit'
            return
        }

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'authenticationToken.label', default: 'AuthenticationToken'), authenticationToken.id])
                redirect authenticationToken
            }
            '*'{ respond authenticationToken, [status: OK] }
        }
    }

    def delete(Long id) {
        if (id == null) {
            notFound()
            return
        }

        authenticationTokenService.delete(id)

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'authenticationToken.label', default: 'AuthenticationToken'), id])
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }
    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'authenticationToken.label', default: 'AuthenticationToken'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }
    *
     */
}
