package org.karajanresearch.oma

import grails.gorm.services.Service

@Service(Composer)
interface ComposerService {

    Composer get(Serializable id)

    List<Composer> list(Map args)

    Long count()

    void delete(Serializable id)

    Composer save(Composer composer)

}