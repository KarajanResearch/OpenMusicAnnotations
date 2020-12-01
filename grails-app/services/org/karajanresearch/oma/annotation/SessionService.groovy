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


    /**
     * build data structure to use in svelte user interface
     * @param session
     * @return
     */
    def getUiStructure(Session session) {

        return [
            id: session.id,
            title: session.title,
            isShared: session.isShared,
            isMine: session.tenantId == springSecurityService.principal.id,
            annotations: session.annotations.collect { Annotation a ->
                return [
                    id: a.id,
                    type: a.type,
                    bar: a.barNumber,
                    beat: a.beatNumber,
                    momentOfPerception: a.momentOfPerception
                ]
            }
        ]
    }

}
