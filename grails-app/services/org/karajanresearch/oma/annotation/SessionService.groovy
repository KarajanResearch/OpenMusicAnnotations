package org.karajanresearch.oma.annotation

import grails.gorm.multitenancy.WithoutTenant
import grails.gorm.transactions.Transactional

@Transactional
class SessionService {


    def getCsvFile(Session session) {

        def data = [[
            "annotationType",
            "momentOfPerception",
            "barNumber",
            "beatNumber",
            "subdivision"
        ]]

        session.annotations.each { Annotation annotation ->
            data.push(
                [
                    annotation.annotationType.name,
                    annotation.momentOfPerception,
                    annotation.barNumber,
                    annotation.beatNumber,
                    annotation.subdivision
                ]
            )
        }
        File.createTempFile("temp",".csv").with {csvFile ->
            // Include the line below if you want the file to be automatically deleted when the
            // JVM exits
            deleteOnExit()

            println absolutePath

            // https://groovy.apache.org/blog/reading-and-writing-csv-files
            csvFile.text = data*.join(",").join(System.lineSeparator())

            return csvFile
        }

    }


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
    @Deprecated
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

        //TODO: add other annotation types


        def annotationType = AnnotationType.findOrSaveWhere(name: uiAnnotation.type)

        switch (annotationType.name) {
            case "Text":

                session.annotations.add(
                    new Annotation(
                        annotationType: annotationType,
                        session: session,
                        momentOfPerception: uiAnnotation.time,
                        stringValue: uiAnnotation.stringValue
                    )
                )

                break
            case "Tap":

                session.annotations.add(
                    new Annotation(
                        annotationType: annotationType,
                        session: session,
                        momentOfPerception: uiAnnotation.time,
                        barNumber: uiAnnotation.bar,
                        beatNumber: uiAnnotation.beat,
                        subdivision: uiAnnotation.subdivision
                    )
                )


                break
            default:
                break
        }







    }

}
