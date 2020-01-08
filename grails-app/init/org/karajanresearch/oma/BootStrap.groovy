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

        def apiUser = new User(
            username: 'omaapi',
            password: '623esZ46m6mEl',
            email: "martin@maigner.net"
        ).save()

        UserRoleGroup.findOrSaveWhere(user: testUser, roleGroup: adminRoleGroup)
        UserRoleGroup.findOrSaveWhere(user: apiUser, roleGroup: adminRoleGroup)

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

        assert User.count() == 2
        assert Role.count() == 1
        assert RoleGroupRole.count() == 1
        assert UserRoleGroup.count() == 2


    }

    def init = { servletContext ->

        initSpringSecurity(servletContext)

        /*
        // ordering of component is important!

        // beethoven 9

        def c1 = Composer.findOrSaveWhere(name: "Ludwig van Beethoven")
        def am1 = AbstractMusic.findOrSaveWhere(composer: c1, title: "Symphony No.9, Op.125")


        def data = "Herbert v. Karajan\tWPO\t1947\thttps://s3.amazonaws.com/open-music-annotations-storage-backend/development/abstractMusicPart/1/2019-09-13-09-41-488_Beethoven9-20Pages.pdf\thttps://s3.amazonaws.com/open-music-annotations-storage-backend/development/recording/1/2019-09-12-12-51-679_Karajan_WPO_1947_Bee_9-1_file_2403.flac\n" +
            "Herbert v. Karajan\tRAI Orchestra\t1954\thttps://s3.amazonaws.com/open-music-annotations-storage-backend/development/abstractMusicPart/2/2019-09-13-09-38-703_Beethoven9-20Pages.pdf\thttps://s3.amazonaws.com/open-music-annotations-storage-backend/development/recording/2/2019-09-12-01-18-174_Karajan_RAI_1954_Bee_9-1_file_2282.flac\n" +
            "Herbert v. Karajan\tPhilharmonia Orchestra\t1955\n" +
            "Herbert v. Karajan\tBPO\t1957\n" +
            "Herbert v. Karajan\tBPO\t1962\n" +
            "Herbert v. Karajan\tBPO\t1977\n" +
            "Herbert v. Karajan\tBPO\t1983\n" +
            "Oskar Fried\tBSOO\t1929\n" +
            "Wilhelm Furtwängler\tOBF\t1951\n" +
            "John Eliot Gardiner\tORR\t1992\n" +
            "Otto Klemperer\tPhilharmonia Orchestra\t1957\n" +
            "Willem Mengelberg\tRCO\t1940\n" +
            "Roger Norrington\tSWRSO\t2002\n" +
            "Arturo Toscanini\tNBCSO\t1952\n" +
            "Willem Mengelberg\tConcertgebouw Orkest\t1926\n" +
            "Hans Rosbaud\tKölner Rundfunk-Sinfonieorchester \t1951\n" +
            "Hermann Scherchen\tPhiladelphia Orchestra\t1964\n" +
            "Georg Solti\tTonhalle-Orchester Zürich\t1997\n" +
            "Georg Solti\tChicago Symphony Orchestra\t1990\n" +
            "Klaus Tennstedt\tLondon Philharmonic Orchestra\t1978\n" +
            "Bruno Walter\tNew York Phiharmonic Orchestra\t1947"


        def lines = data.tokenize("\n")
        lines.each { line ->

            def val = line.tokenize("\t")

            println val

            def i1 = Interpretation.findOrSaveWhere(title: "${val[0]}, ${val[1]}, ${val[2]}")

            def pdfLocation = ""
            if (val[3]) {
                pdfLocation = val[3]
            }

            def amp1 = AbstractMusicPart.findOrSaveWhere(
                title: "1. Allegro ma non troppo, un poco maestoso",
                abstractMusic: am1,
                pdfLocation: pdfLocation,
                interpretation: i1,
                interpretationOrder: new Long(1),
                barNumberOffset: new Double(0.0),
                numberOfBars: new Double(-1.0))

            def r1 = Recording.findOrSaveWhere(interpretation: i1, abstractMusicPart: amp1, title: "Recording of ${i1.title}")

            if (val[4]) {
                def da1 = DigitalAudio.findOrSaveWhere(location: val[4], contentType: "flac")
                r1.addToDigitalAudio(da1)
                r1.save(flush: true)
            }
        }

         */


    }
    def destroy = {
    }
}
