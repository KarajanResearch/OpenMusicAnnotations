package org.karajanresearch.oma.annotation

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
            sessionId: a.session.id,
            type: a.annotationType.name,
            bar: a.barNumber,
            beat: a.beatNumber,
            subdivision: a.subdivision,
            stringValue: a.stringValue,
            momentOfPerception: a.momentOfPerception
        ]
    }

}
