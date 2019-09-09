package oma

class SheetMusicTagLib {
    static defaultEncodeAs = [taglib:'html']
    //static encodeAsForTags = [tagName: [taglib:'html'], otherTagName: [taglib:'none']]

    SheetMusicService sheetMusicService

    def sheetMusic = { attrs, body ->


        println attrs.recording



        out << sheetMusicService.lookupRecording() + " Hello! This is a template for viewing the proper score of " + attrs.recording
    }


    def sheetMusicPlayer = { attrs, body ->



        println attrs.recording



        out << sheetMusicService.lookupRecording() + " Hello! This is a player widget for " + attrs.recording
    }
}
