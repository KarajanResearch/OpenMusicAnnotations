package oma

class BootStrap {

    def init = { servletContext ->


        // ordering of component is important!



        // musicians pick a composition and make music out of it.
        // here, our model starts. At first, an interpretation is vague. Only characterized by a title.
        // Could also be a working title.
        def i1 = Interpretation.findOrSaveWhere(title: "KWV 663")

        // The next step describes the structure of the interpretation.
        // The interpretation could be mapped 1:1 to a single composition or to a set of partial compositions.

        // Our music model starts after the composition process, i.e., our first
        // assumption is an existing composition by some composer.
        def c1 = Composer.findOrSaveWhere(name: "Ludwig van Beethoven")
        def am1 = AbstractMusic.findOrSaveWhere(composer: c1, title: "Symphonie Nr. 4 B-Dur op. 60")


        // we need to support partial compositions because no one is forced to play a whole piece
        def amp1 = AbstractMusicPart.findOrSaveWhere(title: "3. Satz: Allegro vivace", abstractMusic: am1, interpretation: i1, interpretationOrder: new Long(1), barNumberOffset: new Double(0.0), numberOfBars: new Double(-1.0))

        def da1 = DigitalAudio.findOrSaveWhere(location: "s3://someFile.wav")
        // connect recording to abstractMusicPart?
        def r1 = Recording.findOrSaveWhere(interpretation: i1, abstractMusicPart: amp1, digitalAudio: da1, title: "First recording")





    }
    def destroy = {
    }
}
