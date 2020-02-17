package org.karajanresearch.oma.music

import grails.gorm.services.Service

@Service(RenderedImageSample)
interface RenderedImageSampleService {

    RenderedImageSample get(Serializable id)

    List<RenderedImageSample> list(Map args)

    Long count()

    void delete(Serializable id)

    RenderedImageSample save(RenderedImageSample renderedImageSample)

}