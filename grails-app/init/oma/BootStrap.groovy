package oma

class BootStrap {

    def init = { servletContext ->


        // ordering of component is important!



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



    }
    def destroy = {
    }
}
