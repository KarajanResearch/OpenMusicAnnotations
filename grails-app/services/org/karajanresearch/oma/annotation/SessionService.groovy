package org.karajanresearch.oma.annotation

import grails.gorm.multitenancy.WithoutTenant
import grails.gorm.transactions.Transactional

@Transactional
class SessionService {

    /**
     * @WithoutTenant
     *     Session multiTenantManagedGet(Long id) {*         def session = Session.findByIdAndTenantId(id, springSecurityService.principal.id)
     *         if (!session) {*             // not result? try shared Recordings
     *             session = Session.findByIdAndIsShared(id, true)
     *}
     *         return session
     *     }
     */

    def springSecurityService

    @WithoutTenant
    Session get(Serializable id) {
        def session = Session.findByIdAndTenantId(id, springSecurityService.principal.id)
        if (!session) {
            // not result? try shared Recordings
            session = Session.findByIdAndIsShared(id, true)
        }
        return session
    }
}
