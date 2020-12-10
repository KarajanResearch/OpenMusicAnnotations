package org.karajanresearch.oma.annotation

import grails.gorm.multitenancy.WithoutTenant
import grails.gorm.transactions.Transactional

@Transactional
class AnnotationService {

    def springSecurityService

    /**
     * build data structure to use in svelte user interface
     * @param session
     * @return
     */
    def getUiStructure(Annotation a) {
        return [
            id: a.id,
            sessionId: a.session.id,
            isMine: a.tenantId == springSecurityService.principal.id,
            type: a.annotationType.name,
            bar: a.barNumber,
            beat: a.beatNumber,
            momentOfPerception: a.momentOfPerception
        ]
    }

}
