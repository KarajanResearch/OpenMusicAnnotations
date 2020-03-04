package org.karajanresearch.oma

import grails.plugin.springsecurity.rest.token.AccessToken
import grails.plugin.springsecurity.rest.token.generation.TokenGenerator
import org.springframework.security.core.userdetails.UserDetails

class AuthenticationTokenGenerator implements TokenGenerator {


    @Override
    AccessToken generateAccessToken(UserDetails principal) {

        println "generateAccessToken"
        println principal

        return null
    }

    @Override
    AccessToken generateAccessToken(UserDetails principal, Integer expiration) {

        println "generateAccessToken"
        println principal
        println expiration

        return null
    }
}

import org.springframework.context.ApplicationListener
import org.springframework.security.authentication.event.AuthenticationSuccessEvent

class MySecurityEventListener
    implements ApplicationListener<AuthenticationSuccessEvent> {

    void onApplicationEvent(AuthenticationSuccessEvent event) {
        // handle the event
    }
}