package org.karajanresearch.oma.music

import grails.gorm.services.Service
import org.karajanresearch.oma.music.AbstractMusic

@Service(AbstractMusic)
interface AbstractMusicService {

    AbstractMusic get(Serializable id)

    List<AbstractMusic> list(Map args)

    Long count()

    void delete(Serializable id)

    AbstractMusic save(AbstractMusic abstractMusic)

}