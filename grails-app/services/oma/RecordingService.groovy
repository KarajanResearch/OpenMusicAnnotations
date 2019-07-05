package oma

import grails.gorm.services.Service

@Service(Recording)
interface RecordingService {

    Recording get(Serializable id)

    List<Recording> list(Map args)

    Long count()

    void delete(Serializable id)

    Recording save(Recording recording)

}