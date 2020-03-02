package org.karajanresearch.oma


import org.karajanresearch.oma.music.AbstractMusic
import org.karajanresearch.oma.music.AbstractMusicPart
import org.karajanresearch.oma.music.Composer
import org.karajanresearch.oma.music.DigitalAudio
import org.karajanresearch.oma.music.Interpretation
import org.karajanresearch.oma.music.Recording

class BootStrap {

    def initSpringSecurity(servletContext) {


        def adminRoleGroup = new RoleGroup(name: "GROUP_ADMIN").save()
        def adminRole = new Role(authority: 'ROLE_ADMIN').save()

        RoleGroupRole.findOrSaveWhere(roleGroup: adminRoleGroup, role: adminRole)

        def testUser = new User(
            username: 'oma',
            password: '=PSe?sZ-ymp6mE>2',
            email: "martin@maigner.net"
        ).save()


        UserRoleGroup.findOrSaveWhere(user: testUser, roleGroup: adminRoleGroup)

        UserRoleGroup.withSession {
            it.flush()
            it.clear()
        }

        /*UserRole.create testUser, adminRole, true

        UserRole.withSession {
            it.flush()
            it.clear()
        }
        */

        /*
        assert User.count() == 2
        assert Role.count() == 1
        assert RoleGroupRole.count() == 1
        assert UserRoleGroup.count() == 2
*/

    }

    def init = { servletContext ->

        initSpringSecurity(servletContext)

    }
    def destroy = {
    }
}
