package org.karajanresearch.oma.music

import grails.gorm.services.Service

@Service(DigitalAudio)
interface DigitalAudioService {

    DigitalAudio get(Serializable id)

    List<DigitalAudio> list(Map args)

    Long count()

    void delete(Serializable id)

    DigitalAudio save(DigitalAudio digitalAudio)

}