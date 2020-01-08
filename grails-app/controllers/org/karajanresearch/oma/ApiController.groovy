package org.karajanresearch.oma

import grails.converters.JSON
import grails.gorm.transactions.ReadOnly
import grails.plugin.springsecurity.annotation.Secured
import org.karajanresearch.oma.api.AnnotationApiService
import org.karajanresearch.oma.api.ComposerApiService

/**
 * oma.cloud/api/
  */
@Secured("ROLE_ADMIN")
class ApiController {


    // TODO: add api call to add recordings.
    // apply to spreadsheet!
    // perform import in jupyter

    ComposerApiService composerApiService

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
