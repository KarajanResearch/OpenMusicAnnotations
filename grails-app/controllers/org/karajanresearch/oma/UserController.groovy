package org.karajanresearch.oma

import grails.converters.JSON
import grails.plugin.springsecurity.SpringSecurityService
import grails.plugin.springsecurity.annotation.Secured
import grails.plugin.springsecurity.rest.token.generation.SecureRandomTokenGenerator
import grails.plugin.springsecurity.rest.token.generation.TokenGenerator
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Lazy

import java.security.SecureRandom

@Secured("ROLE_ADMIN")
class UserController {

    @Autowired
    @Lazy
    SpringSecurityService springSecurityService


    /**
     * logged in user details
     * @return
     */
    def show() {
        def user  = (User)springSecurityService.getCurrentUser()
        respond(user)
    }

    /**
     * API docs, token, and stuff
     * @return
     */
    def help() {

        def user  = (User)springSecurityService.getCurrentUser()
        def tokenList = AuthenticationToken.findAllByUsername(user.username)

        def model = [tokenList: tokenList]

        render model as JSON

        //render(view: "help", model: model)
    }

    def refreshToken() {
        def principal  = springSecurityService.principal

        TokenGenerator tg = new SecureRandomTokenGenerator()
        def token = tg.generateAccessToken(principal)

        render token as JSON
    }
}
