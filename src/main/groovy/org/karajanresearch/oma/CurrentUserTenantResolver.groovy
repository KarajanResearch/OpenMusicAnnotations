package org.karajanresearch.oma

import grails.gorm.DetachedCriteria
import grails.plugin.springsecurity.SpringSecurityService
import groovy.transform.CompileDynamic
import groovy.transform.CompileStatic
import org.grails.datastore.mapping.multitenancy.AllTenantsResolver
import org.grails.datastore.mapping.multitenancy.TenantResolver
import org.grails.datastore.mapping.multitenancy.exceptions.TenantNotFoundException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Lazy
import org.springframework.security.core.userdetails.UserDetails

@CompileStatic
class CurrentUserTenantResolver implements AllTenantsResolver {


    @Autowired
    @Lazy
    SpringSecurityService springSecurityService

    @Override
    Serializable resolveTenantIdentifier() throws TenantNotFoundException {
        User user = loggedInUser()
        if ( user ) {
            return (Long)user.id
        }
        (Long)0
        /*
        throw new TenantNotFoundException("Tenant could not be resolved from Spring Security Principal")

         */
    }

    /*
    String loggedUsername() {
        if ( springSecurityService.principal instanceof String ) {
            return springSecurityService.principal
        }
        if (springSecurityService.principal instanceof UserDetails) {
            return ((UserDetails) springSecurityService.principal).username
        }
        return "unknown"
        // null
    }
    */

    User loggedInUser() {
        return (User)springSecurityService.getCurrentUser()
    }



    @Override
    Iterable<Serializable> resolveTenantIds() {
        User.withTransaction(readOnly: true) {
            new DetachedCriteria(User)
                .distinct('id')
                .list()  as Iterable<Serializable>
        }
    }

}
