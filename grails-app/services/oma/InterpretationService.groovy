package oma

import grails.gorm.services.Service

@Service(Interpretation)
interface InterpretationService {

    Interpretation get(Serializable id)

    List<Interpretation> list(Map args)

    Long count()

    void delete(Serializable id)

    Interpretation save(Interpretation interpretation)

}