package org.karajanresearch.oma.music

import grails.gorm.services.Service

@Service(RenderedWaveForm)
interface RenderedWaveFormService {

    RenderedWaveForm get(Serializable id)

    List<RenderedWaveForm> list(Map args)

    Long count()

    void delete(Serializable id)

    RenderedWaveForm save(RenderedWaveForm renderedWaveForm)

}