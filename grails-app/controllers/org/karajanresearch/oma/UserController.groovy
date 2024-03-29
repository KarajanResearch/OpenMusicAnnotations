package org.karajanresearch.oma

import grails.converters.JSON
import grails.plugin.springsecurity.SpringSecurityService
import grails.plugin.springsecurity.annotation.Secured
import grails.plugin.springsecurity.rest.token.generation.SecureRandomTokenGenerator
import grails.plugin.springsecurity.rest.token.generation.TokenGenerator
import grails.validation.ValidationException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Lazy

@Secured('permitAll')
class UserController {

    @Autowired
    @Lazy
    SpringSecurityService springSecurityService

    static allowedMethods = [register: "POST"]

    @Secured("ROLE_AUTHENTICATED")
    def index() { }

    // TODO: do not automatically activate account
    // notify user, once account was activated
    @Secured("ROLE_ADMIN")
    def register() {
        if(!params.password.equals(params.repassword)) {
            flash.message = "Password and Re-Password not match"
            redirect action: "index"
            return
        } else {
            try {

                // we use role groups and assign users to role groups rather than to roles.

                def user = User.findByUsername(params.username)
                if (user) {
                    flash.message = "Username already taken"
                    render view: "index"
                    return
                }

                if (!user) {
                    user = new User(username: params.username, password: params.password, email: params.email)

                    if (!user.validate()) {
                        println user.errors
                        flash.message = "Data validation failed"
                        render view: "index"
                        return
                    }

                    if (!user.save()) {
                        println user.errors
                        flash.message = "User creation failed"
                        render view: "index"
                        return
                    }
                }

                println user

                // set to unprivileged
                // ROLE_AUTHENTICATED
                def roleGroup = RoleGroup.findByName("GROUP_USER")
                //def role = Role.get(params.role.id)

                println roleGroup

                if(user && roleGroup) {
                    UserRoleGroup.create user, roleGroup

                    UserRoleGroup.withSession {
                        it.flush()
                        it.clear()
                    }

                    flash.message = "You have registered successfully. Please login."
                    redirect controller: "login", action: "auth"
                } else {
                    flash.message = "Register failed"
                    render view: "index"
                    return
                }
            } catch (ValidationException e) {
                flash.message = "Register Failed"
                redirect action: "index"
                return
            }
        }
    }




    @Secured("ROLE_AUTHENTICATED")
    def passwordExpired() {
        println session

        println "passwordExpired for " + session['SPRING_SECURITY_LAST_USERNAME']

        [username: session['SPRING_SECURITY_LAST_USERNAME']]
    }




    def passwordEncoder
    /**
     * changing password
     */
    @Secured("ROLE_AUTHENTICATED")
    def updatePassword(String password, String password_new, String password_new_2) {

        String username = session['SPRING_SECURITY_LAST_USERNAME']
        if (!username) {
            flash.message = 'Sorry, an error has occurred'
            redirect controller: 'login', action: 'auth'
            return
        }

        if (!password || !password_new || !password_new_2 || password_new != password_new_2) {
            flash.message = 'Please enter your current password and a valid new password'
            render view: 'passwordExpired', model: [username: session['SPRING_SECURITY_LAST_USERNAME']]
            return
        }

        User user = User.findByUsername(username)
        if (!passwordEncoder.isPasswordValid(user.password, password, null)) {
            flash.message = 'Current password is incorrect'
            render view: 'passwordExpired', model: [username: session['SPRING_SECURITY_LAST_USERNAME']]
            return
        }

        if (passwordEncoder.isPasswordValid(user.password, password_new, null)) {
            flash.message = 'Please choose a different password from your current one'
            render view: 'passwordExpired', model: [username: session['SPRING_SECURITY_LAST_USERNAME']]
            return
        }

        user.password = password_new
        user.passwordExpired = false
        // if you have password constraints check them here
        if (!user.save(flush:true)) {
            flash.message = "Credentials could not be saved. Contact admin"
            render view: 'passwordExpired', model: [username: session['SPRING_SECURITY_LAST_USERNAME']]
            return
        }
        flash.message = 'Your password has been updated'
        redirect controller: 'user', action: 'show'
    }






    /**
     * logged in user details
     * @return
     */
    @Secured("ROLE_AUTHENTICATED")
    def show() {
        def user  = (User)springSecurityService.getCurrentUser()

        def model = [
            user: user,
            tokenList: AuthenticationToken.findAllByUsername(user.username)
        ]


        render(view: "show", model: model)
    }

    /**
     * API docs, token, and stuff
     * @return
     */
    @Secured("ROLE_AUTHENTICATED")
    def help() {

        def user  = (User)springSecurityService.getCurrentUser()
        def tokenList = AuthenticationToken.findAllByUsername(user.username)

        def model = [tokenList: tokenList]

        render model as JSON

        //render(view: "help", model: model)
    }

    @Secured("ROLE_AUTHENTICATED")
    def refreshToken() {
        def principal  = springSecurityService.principal

        TokenGenerator tg = new SecureRandomTokenGenerator()
        def token = tg.generateAccessToken(principal)

        def authToken = new AuthenticationToken(username: token.principal.username, dateCreated: new Date(), tokenValue: token.accessToken).save(flush: true)

        //render token as JSON
        redirect (action: "show")
    }
}
