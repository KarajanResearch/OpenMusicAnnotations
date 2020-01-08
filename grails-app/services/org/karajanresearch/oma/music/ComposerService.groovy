package org.karajanresearch.oma.music

import grails.gorm.services.Service
import org.karajanresearch.oma.music.Composer

@Service(Composer)
interface ComposerService {

    Composer get(Serializable id)

    List<Composer> list(Map args)

    Long count()

    void delete(Serializable id)

    Composer save(Composer composer)

}