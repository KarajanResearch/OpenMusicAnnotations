package org.karajanresearch.oma

import org.karajanresearch.oma.annotation.AnnotationType
import org.karajanresearch.oma.music.AbstractMusic
import org.karajanresearch.oma.music.AbstractMusicPart
import org.karajanresearch.oma.music.Composer
import org.karajanresearch.oma.music.DigitalAudio
import org.karajanresearch.oma.music.Interpretation
import org.karajanresearch.oma.music.Recording

class BootStrap {

    def initSpringSecurity(servletContext) {


        def adminRoleGroup = RoleGroup.findOrSaveWhere(name: "GROUP_ADMIN")
        def adminRole = Role.findOrSaveWhere(authority: "ROLE_ADMIN")

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

        // initSpringSecurity(servletContext)

        // init annotation types

        AnnotationType.findOrSaveWhere(name: "Tap")
        AnnotationType.findOrSaveWhere(name: "Emotion")
        AnnotationType.findOrSaveWhere(name: "Text")


        AnnotationType.withSession {
            it.flush()
            it.clear()
        }


    }
    def destroy = {
    }
}
