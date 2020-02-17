package org.karajanresearch.oma.music

class RenderedWaveForm {

    static belongsTo = [recording: Recording]

    // a series of images


    static hasMany = [renderedImageSamples: RenderedImageSample]



    static constraints = {
    }
}
