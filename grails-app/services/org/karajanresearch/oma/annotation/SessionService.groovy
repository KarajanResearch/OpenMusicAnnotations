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

    def annotationService

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
                return annotationService.getUiStructure(a)
            }
        ]
    }


    /**
     * converts UI annotation data structure to Annotation and adds it to session
     * // TODO: dynamic type instead of Tap by default
     * @param uiAnnotation
     * @param session
     */
    def addUiAnnotationToSession(uiAnnotation, Session session) {

        def labelParts = uiAnnotation.labelText.tokenize(":")
        def barNumber = Integer.parseInt(labelParts[0])
        def beatNumber = Integer.parseInt(labelParts[1])
        session.annotations.add(
            new Annotation(
                annotationType: AnnotationType.findOrSaveWhere(name: uiAnnotation.type),
                session: session,
                momentOfPerception: uiAnnotation.time,
                barNumber: barNumber,
                beatNumber: beatNumber
            )
        )

    }

}
