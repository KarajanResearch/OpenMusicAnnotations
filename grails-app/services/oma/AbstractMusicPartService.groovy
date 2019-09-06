package oma

import grails.gorm.services.Service

@Service(AbstractMusicPart)
interface AbstractMusicPartService {

    AbstractMusicPart get(Serializable id)

    List<AbstractMusicPart> list(Map args)

    Long count()

    void delete(Serializable id)

    AbstractMusicPart save(AbstractMusicPart abstractMusicPart)

}