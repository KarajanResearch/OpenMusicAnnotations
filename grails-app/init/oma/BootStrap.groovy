package oma

class BootStrap {

    def init = { servletContext ->


        // ordering of component is important!

        // beethoven 9

        def c1 = Composer.findOrSaveWhere(name: "Ludwig van Beethoven")
        def am1 = AbstractMusic.findOrSaveWhere(composer: c1, title: "Symphony No.9, Op.125")



        def data = "Herbert v. Karajan\tWPO\t1947\thttps://s3.amazonaws.com/open-music-annotations-storage-backend/development/abstractMusicPart/1/2019-09-12-12-53-332_IMSLP516488-PMLP1607-Beethoven_-_Symphony_No.9,_Op.125.pdf\thttps://s3.amazonaws.com/open-music-annotations-storage-backend/development/recording/1/2019-09-12-12-51-679_Karajan_WPO_1947_Bee_9-1_file_2403.flac\n" +
            "Herbert v. Karajan\tRAI Orchestra\t1954\n" +
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


        /*





        // musicians pick a composition and make music out of it.
        // here, our model starts. At first, an interpretation is vague. Only characterized by a title.
        // Could also be a working title.
        def i1 = Interpretation.findOrSaveWhere(title: "Maurice Abravanel, Utah Symphony Orchestra, 1977")

        // The next step describes the structure of the interpretation.
        // The interpretation could be mapped 1:1 to a single composition or to a set of partial compositions.

        // Our music model starts after the composition process, i.e., our first
        // assumption is an existing composition by some composer.
        def c1 = Composer.findOrSaveWhere(name: "Jean Sibelius")
        def am1 = AbstractMusic.findOrSaveWhere(composer: c1, title: "Symphony No.6, Op.104")


        // we need to support partial compositions because no one is forced to play a whole piece
        def amp1 = AbstractMusicPart.findOrSaveWhere(
            title: "1. Allegro molto moderato",
            abstractMusic: am1,
            interpretation: i1,
            interpretationOrder: new Long(1),
            barNumberOffset: new Double(0.0),
            numberOfBars: new Double(-1.0))

        //def da1 = DigitalAudio.findOrSaveWhere(location: "https://kapi.cloud/kwvTrack/stream/28913", contentType: "stream")
        // connect recording to abstractMusicPart?
        def r1 = Recording.findOrSaveWhere(interpretation: i1, abstractMusicPart: amp1, title: "Recorded 1977")
        //r1.addToDigitalAudio(da1).save()



        // https://kapi.cloud/kwvTrack/stream/12836
        def i2 = Interpretation.findOrSaveWhere(title: "Vladimir Ashkenazy, Philharmonia Orchestra, 1984")
        def amp2 = AbstractMusicPart.findOrSaveWhere(
            title: "1. Allegro molto moderato",
            abstractMusic: am1,
            interpretation: i2,
            interpretationOrder: new Long(1),
            barNumberOffset: new Double(0.0),
            numberOfBars: new Double(-1.0))


        //def da2 = DigitalAudio.findOrSaveWhere(location: "https://kapi.cloud/kwvTrack/stream/12836", contentType: "stream")
        // connect recording to abstractMusicPart?
        def r2 = Recording.findOrSaveWhere(interpretation: i2, abstractMusicPart: amp2, title: "Recorded 1984")

        //r2.addToDigitalAudio(da2).save()


*/

    }
    def destroy = {
    }
}
