package org.karajanresearch.oma

import grails.gorm.services.Service

@Service(AuthenticationToken)
interface AuthenticationTokenService {

    AuthenticationToken get(Serializable id)

    List<AuthenticationToken> list(Map args)

    Long count()

    void delete(Serializable id)

    AuthenticationToken save(AuthenticationToken authenticationToken)

}