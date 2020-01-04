package org.karajanresearch.oma.api

import grails.gorm.transactions.Transactional

import org.karajanresearch.oma.annotation.Annotation

@Transactional
class RecordingApiService {

    def annotationWindow(Annotation from, Annotation to) {

        def windowStart = from.momentOfPerception
        def windowEnd = to.momentOfPerception

        println "Cutting audio " + windowStart + " to " + windowEnd


    }
}
