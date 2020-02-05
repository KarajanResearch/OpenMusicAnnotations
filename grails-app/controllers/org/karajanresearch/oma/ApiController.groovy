package org.karajanresearch.oma

import grails.converters.JSON
import grails.gorm.transactions.ReadOnly
import grails.plugin.springsecurity.annotation.Secured
import org.karajanresearch.oma.api.AnnotationApiService
import org.karajanresearch.oma.api.ComposerApiService
import org.karajanresearch.oma.api.InterpretationApiService
import org.karajanresearch.oma.api.RecordingApiService
import org.karajanresearch.oma.api.ScoreApiService
import org.karajanresearch.oma.music.AbstractMusic

/**
 * oma.cloud/api/
  */
@Secured("ROLE_ADMIN")
class ApiController {


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
            case "list":
                r = composerApiService.listComposer(params)
                break
            case "findBy":
                switch (params["findBy"]) {
                    case "name":
                        r = composerApiService.findByName(params)
                        break
                }
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
            case "list":
                r = AbstractMusic.list(params)
                break
            case "findBy":
                switch (params["findBy"]) {
                    case "composer":
                        r = composerApiService.findCompositionByComposer(params)
                        break
                }
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
            case "find":
                if (!params["findBy"]) break
                switch (params["findBy"]) {
                    case "composition":
                        r = interpretationApiService.findByComposition(params)
                        break
                }
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
            case "get":
                r = recordingApiService.getRecording(params)
                break
            case "getAudio":
                def file = recordingApiService.getRecordingAudio(params)
                if (file) {
                    println "loaded File"

                    response.setContentType("APPLICATION/OCTET-STREAM")
                    response.setHeader("Content-Disposition", "Attachment;Filename=\"${file.name}\"")

                    def outputStream = response.getOutputStream()
                    outputStream << file.newInputStream()
                    outputStream.flush()
                    outputStream.close()
                    return
                }
                break
        }

        if (!r) {
            r = ["error": "recording"]
        }

        render r as JSON
    }


    AnnotationApiService annotationApiService

    def session() {
        println "session"
        println params

        def r = [error: "not implemented"]

        switch (params["method"]) {
            case "add":
                // r = recordingApiService.addRecording(params)
                r = annotationApiService.addSession(params)
                break
        }

        render r as JSON
    }


    def annotation() {
        println "annotation"
        println params

        def r = [error: "not implemented"]

        switch (params["method"]) {
            case "findBy":
                if (!params["findBy"]) break
                switch (params["findBy"]) {
                    case "recording":
                        r = annotationApiService.findByRecording(params)
                        break
                }
                break

        }

        render r as JSON
    }



    ScoreApiService scoreApiService

    def score() {
        println "score"
        println params

        def r = [error: "not implemented"]

        switch (params["method"]) {
            case "add":
                // r = recordingApiService.addRecording(params)
                r = scoreApiService.addScore(params)
                break
        }

        render r as JSON
    }



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
