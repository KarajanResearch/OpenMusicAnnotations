package org.karajanresearch.oma.music

class RenderedImageSample implements Comparable {


    static belongsTo = [renderedWaveForm: RenderedWaveForm]
    /**
     * offset in the track
     */
    Integer fromSample
    Integer toSample
    Integer sampleRate

    /**
     * image uri
     */
    String location



    static constraints = {
        fromSample nullable: false
        toSample nullable: false
        location nullable: false
        sampleRate nullable: false
    }

    int compareTo(obj) {
        return fromSample.compareTo(obj.fromSample)
    }

    String toString() {
        return location
    }

}
