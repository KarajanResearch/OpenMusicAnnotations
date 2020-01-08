package org.karajanresearch.oma.music

import grails.gorm.services.Service
import org.karajanresearch.oma.music.Interpretation

@Service(Interpretation)
interface InterpretationService {

    Interpretation get(Serializable id)

    List<Interpretation> list(Map args)

    Long count()

    void delete(Serializable id)

    Interpretation save(Interpretation interpretation)

}