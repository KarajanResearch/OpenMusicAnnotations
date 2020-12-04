package org.karajanresearch.oma.annotation

import grails.gorm.multitenancy.WithoutTenant
import grails.gorm.transactions.Transactional

@Transactional
class AnnotationService {


    /**
     * build data structure to use in svelte user interface
     * @param session
     * @return
     */
    def getUiStructure(Annotation a) {
        return [
            id: a.id,
            type: a.type,
            bar: a.barNumber,
            beat: a.beatNumber,
            momentOfPerception: a.momentOfPerception
        ]
    }



}
