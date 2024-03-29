package org.karajanresearch.oma

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import grails.compiler.GrailsCompileStatic

@GrailsCompileStatic
@EqualsAndHashCode(includes='username')
@ToString(includes='username', includeNames=true, includePackage=false)
class User implements Serializable {

    private static final long serialVersionUID = 1

    String username
    String password
    boolean enabled = true
    String email
    boolean accountExpired
    boolean accountLocked
    boolean passwordExpired

    Set<RoleGroup> getAuthorities() {
        def roleGroups = (UserRoleGroup.findAllByUser(this) as List<UserRoleGroup>)*.roleGroup as Set<RoleGroup>
        println roleGroups
        return roleGroups
    }

    static constraints = {
        password nullable: false, blank: false, password: true
        username nullable: false, blank: false, unique: true
        email email: true, blank: false
    }

    static mapping = {
        table 'appuser'
        password column: '`password`'
    }
}
