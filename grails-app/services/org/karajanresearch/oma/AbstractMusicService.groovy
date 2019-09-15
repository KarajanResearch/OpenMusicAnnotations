package org.karajanresearch.oma

import grails.gorm.services.Service

@Service(AbstractMusic)
interface AbstractMusicService {

    AbstractMusic get(Serializable id)

    List<AbstractMusic> list(Map args)

    Long count()

    void delete(Serializable id)

    AbstractMusic save(AbstractMusic abstractMusic)

}