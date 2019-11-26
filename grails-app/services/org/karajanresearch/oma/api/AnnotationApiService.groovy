package org.karajanresearch.oma.api

// import grails.gorm.transactions.Transactional
import org.karajanresearch.oma.annotation.Annotation
import org.karajanresearch.oma.annotation.Session

// @Transactional
class AnnotationApiService {

    /**
     *
     * @param params
     * @param params.annotationId the id of an existing annotation object. Returns a single annotation object
     * @return
     */
    def get(params) {

        if (params.annotationId) {
            return Annotation.get(params.annotationId)
        }

        // returns a sorted Set of annotations for some session
        return Session.findByTitleIsNotNull().annotations
    }


}
