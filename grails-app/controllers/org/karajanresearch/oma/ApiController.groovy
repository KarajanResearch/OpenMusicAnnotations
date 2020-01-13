package org.karajanresearch.oma

import grails.converters.JSON
import grails.gorm.transactions.ReadOnly
import grails.plugin.springsecurity.annotation.Secured
import org.karajanresearch.oma.api.AnnotationApiService
import org.karajanresearch.oma.api.ComposerApiService
import org.karajanresearch.oma.api.InterpretationApiService
import org.karajanresearch.oma.api.RecordingApiService

/**
 * oma.cloud/api/
  */
@Secured("ROLE_ADMIN")
class ApiController {


    // TODO: add api call to add recordings.
    // apply to spreadsheet!
    // perform import in jupyter

    ComposerApiService composerApiService
    InterpretationApiService interpretationApiService
    RecordingApiService recordingApiService

    /**
     * requires param.method to select what to call in composerApiService
     * @return
     */
    def composer() {
        println "composer"
        println params

        def r = [error: "not implemented"]

        switch (params["method"]) {
            case "add":
                r = composerApiService.addComposer(params)
                break
        }

        render r as JSON
    }

    /**
     * requires param.method to select what to call in composerApiService
     * @return
     */
    def composition() {
        println "composition"
        println params

        def r = [error: "not implemented"]

        switch (params["method"]) {
            case "add":
                r = composerApiService.addComposition(params)
                break
        }

        render r as JSON
    }

    def interpretation() {
        println "interpretation"
        println params

        def r = [error: "not implemented"]

        switch (params["method"]) {
            case "add":
                r = interpretationApiService.addInterpretation(params)
                break
            case "addAbstractMusicPart":
                r = interpretationApiService.addAbstractMusicPart(params)
                break
        }

        render r as JSON
    }


    def recording() {
        println "recording"
        println params

        def r = [error: "not implemented"]

        switch (params["method"]) {
            case "add":
                r = recordingApiService.addRecording(params)
                break
        }

        if (!r) {
            r = ["error": "recording"]
        }

        render r as JSON
    }





    AnnotationApiService annotationApiService

    @ReadOnly
    def get() {

        //println id
        println params

        //def r = annotationApiService.serviceMethod(params)
        def result = [error: "Not implemented"]

        switch (params.id) {
            case "annotation":
                result = annotationApiService.get(params)
                break


        }
        render result as JSON
    }


    def addRecording() {
        println params


        def result = [:]

        result.status = 200
        result.recording = null

        render result as JSON

    }
}
