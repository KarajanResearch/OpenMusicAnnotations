package oma

class BootStrap {

    def init = { servletContext ->



        def c1 = Composer.findOrSaveWhere(name: "Ludwig van Beethoven")
        def am1 = AbstractMusic.findOrSaveWhere(composer: c1, title: "Die Fünfte")

        def i1 = Interpretation.findOrSaveWhere(title: "Karajan Conducts the Fünfte on July 5")

        def amp1 = AbstractMusicPart.findOrSaveWhere(abstractMusic: am1, interpretation: i1, interpretationOrder: new Long(1), barNumberOffset: new Double(0.0), numberOfBars: new Double(-1.0))

        def da1 = DigitalAudio.findOrSaveWhere(location: "s3://someFile.wav")
        def r1 = Recording.findOrSaveWhere(interpretation: i1, digitalAudio: da1, title: "First recording")





    }
    def destroy = {
    }
}
