package org.karajanresearch.oma.music

import grails.gorm.multitenancy.CurrentTenant
import grails.gorm.services.Service
import grails.plugin.springsecurity.SpringSecurityService
import org.karajanresearch.oma.music.Composer

@CurrentTenant
interface IComposerDataService {

    Composer get(Serializable id)

    List<Composer> list(Map args)

    Long count()

    void delete(Serializable id)

    Composer save(Composer composer)


    Composer find(String name)

}

@Service(Composer)
@CurrentTenant
abstract class ComposerDataService implements IComposerDataService {

    //SpringSecurityService springSecurityService



    // TODO: multi-tenancy
    // https://guides.grails.org/discriminator-per-tenant/guide/index.html

    // https://youtu.be/6pIOgv7cZzo?t=2123

    // http://guides.grails.org/grails-custom-security-tenant-resolver/guide/index.html




}