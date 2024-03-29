package org.karajanresearch.oma.music

import grails.converters.JSON
import grails.core.GrailsApplication
import grails.gorm.transactions.Transactional
import org.karajanresearch.oma.annotation.Annotation
import org.karajanresearch.oma.annotation.Session

//import groovyx.net.http.HTTPBuilder

//import groovyx.net.http.ContentType

import static org.springframework.http.HttpStatus.*
import grails.plugin.springsecurity.annotation.Secured


@Secured("ROLE_AUTHENTICATED")
class RecordingController {

    static scaffold = Recording


    def recordingService
    def tappingService
    def sessionService


    /**
     * AJAX call from dropzone in create.gsp to add wav file
     * encapsulated as DigitalAudioCommand
     */
    @Transactional
    def addDigitalAudio(DigitalAudioCommand cmd) {


        println "addDigitalAudio: " + params

        if (cmd.hasErrors()) {
            println cmd.errors
            //respond(cmd.errors, model: [:], view: 'create')
            render (status: 500, "command has errors")
            return
        }

        Recording recording = Recording.get(cmd.id)

        println recording

        recordingService.storeDigitalAudio(recording, cmd)


        render (status: 200, "WAV file added")
    }


    def addInterpretation(Long id) {

        def recording = Recording.get(id)
        if (!recording) return notFound()


        // add interpretation

        render(view: "addInterpretation", model: [recording: recording])
    }


    def ajaxMoveAnnotation() {

        println "ajaxMoveAnnotation"
        println params

        def annotation = Annotation.get(params.annotation)
        if (!annotation) {
            def result = [error: "invalid annotation"]
            render result as JSON
            return
        }


        try {

            annotation.momentOfPerception = Double.parseDouble(params.momentOfPerception)

        } catch(Exception ex) {
            def result = [error: ex.message]
            render result as JSON
            return
        }

        if (!annotation.save(flush: true)) {
            def result = [error: annotation.errors]
            render result as JSON
        } else {
            render annotation as JSON
        }
    }


    def ajaxCreateAnnotation() {
        println "ajaxCreateAnnotation"
        println params

        def session = Session.get(params.session)
        if (!session) {
            render (status: 404, "Segment not found")
            return
        }

        String label = params.text

        // switch on label to detect type

        Double t = Double.parseDouble(params.momentOfPerception)

        def a = new Annotation(type: "beat", session: session, stringValue: label, momentOfPerception: t)
        if (!a.save(flush: true)) {
            println a.errors
            render ([error: a.errors]) as JSON
            return
        }

        render a as JSON
    }

    /**
     * parameters list:
     * params.recording
     * params.sessionTitle
     *
     * @return
     */
    def ajaxCreateSession() {

        println "ajaxCreateSession"
        println params

        def recording = Recording.get(params.recording)
        if (!recording) return notFound()

        def session = new Session(recording: recording, annotations: [], title: params.sessionTitle)


        if (!session.save(flush: true)) {
            println session.errors
            render ([error: session.errors]) as JSON
            return
        }

        println session

        render session as JSON

    }

    def ajaxDeleteSession() {
        println "ajaxCreateSession"
        println params

        def session = Session.get(params.session)
        if (!session) return notFound()


        try {
            session.delete(flush: true)
        } catch (Exception ex) {
            def result = [error: ex.message]
            render result as JSON
            return
        }


        def result = [success: "Alright"]
        render result as JSON

    }

    /**
     * called from recording.show view
     * @return
     */
    /*
    @Deprecated
    def ajaxUploadTapData() {
        println params
        def recording = Recording.get(params.recording)
        def sessionName = "ajaxUploadTapData at " + new Date().toString()
        def session = new Session(recording: recording, title: sessionName)

        params["tapList"].tokenize(";").each { tapTime ->
            Double t = Double.parseDouble(tapTime)

            def a = new Annotation(type: "Tap", momentOfPerception: t, session: session)
            session.addToAnnotations(a)

        }
        if (!session.save(flush: true)) {
            println session.errors
        }
        def result = [success: "Alright"]
        render result as JSON
    }
     */

    /**
     * called from sheetMusicPlayer
     * @return
     */
    /*
    def ajaxResetSheetMusicPageSelection() {
        def recording = Recording.get(params.recording)
        if (!recording) {
            result = [error: "No recording"]
            render result as JSON
            return
        }
        recording.abstractMusicPart.pdfPageChangeAnnotationSession.delete()
        def result = [success: "Alright"]
        render result as JSON
    }
     */

    /**
     * called from sheetMusicPlayer
     * @return
     */
    /*
    def ajaxUploadSheetMusicPageSelection() {
        println "ajaxUploadSheetMusicPageSelection"
        println params

        Double t = Double.parseDouble(params.playheadLocation)
        Integer pageNumber = Integer.parseInt(params.pageNumber)

        def recording = Recording.get(params.recording)
        def result
        if (!recording) {
            result = [error: "No recording"]
        }

        def session = recording.abstractMusicPart.pdfPageChangeAnnotationSession

        if (!recording.abstractMusicPart.pdfPageChangeAnnotationSession) {
            recording.abstractMusicPart.pdfPageChangeAnnotationSession = new Session(
                title: "Page change annotations",
                recording: recording,
                annotations: []
            ).save()
        }

        if (!recording.abstractMusicPart.pdfPageChangeAnnotationSession.annotations) {
            println "no anno"
            //def result = [error: "no annotations"]
            //render result as JSON
            //return
        }

        def a = Annotation.findOrSaveWhere(type: "PdfPageChangeEvent",
            intValue: pageNumber,
            session: recording.abstractMusicPart.pdfPageChangeAnnotationSession
        )
        a.momentOfPerception = t

        if (!a.save()) {
            println "a.errors"
            println a.errors
        }

        println(a)

        if (!a) {
            println "no a"
        }

        if (!recording.abstractMusicPart.pdfPageChangeAnnotationSession.annotations.contains(a)) {
            recording.abstractMusicPart.pdfPageChangeAnnotationSession.addToAnnotations(a)
        }
        recording.abstractMusicPart.pdfPageChangeAnnotationSession.save()


        if (!recording.abstractMusicPart.save(flush: true)) {
            println recording.abstractMusicPart.errors
        }


        result = [success: "Alright"]
        render result as JSON
    }
    */




    def ajaxGetSession() {
        println "ajaxGetSession"
        println params

        if (params.session == "null" || params.session == "-1") {
            render ([error: "no session"]) as JSON
            return
        }

        Session session = sessionService.get(Long.parseLong(params.session))
        if (!session) {
            render ([error: "no session found"]) as JSON
            return
        }
        JSON.use("deep")
        render session as JSON
    }


    def compare() {
        println "compare"
        try {
            List recordingIds = params['recording[]']
            if (!recordingIds) {
                render "no selection, go back please"
                return
            }
            def recordings = Recording.findAllByIdInList(recordingIds).sort {
                it.title
            }.collect {
                return [
                    recording: it,
                    isMine: recordingService.isMine(it)
                ]
            }

            render view: "compare", model: [recordings: recordings]
        } catch (Exception ex) {
            try {

                redirect(action: "show", id: params['recording[]'])

            } catch (Exception ex2) {
                return notFound()
            }
        }

    }

    def python() {
        println "python"
        try {
            List recordingIds = params['recording[]']
            if (!recordingIds) {
                render "no selection, go back please"
                return
            }
            def recordings = Recording.findAllByIdInList(recordingIds).sort {
                it.title
            }
            render view: "python", model: [recordings: recordings]

        } catch (Exception ex) {
            try {

                redirect(action: "show", id: params['recording[]'])

            } catch (Exception ex2) {
                return notFound()
            }
        }

    }

    def vizPlayFrame(Long id) {
        def recording = Recording.get(id)

        if (!recording) {
            return notFound()
        }

        def model = [recording: recording]

        //render model as JSON

        render view: "vizPlayFrame", model: model
    }


    /**
     * filling the svelte user interface
     * @param id
     * @return
     */
    def ui(Long id) {
        Recording recording = recordingService.get(id)
        if (!recording) return notFound()

        def model = [recording: recording, isMine: recordingService.isMine(recording)]

        render view: "svelteUi", model: model
    }

    /**
     * Svelte UI async Stuff below
     * @param id
     * @return
     */
    def ajaxGet(Long id) {
        Recording recording = recordingService.get(id)
        if (!recording) return notFound()

        def model = [recording: recording, isMine: recordingService.isMine(recording)]
        render model as JSON
    }

    /**
     * fetch all readable sessions for a given recording
     * @param id recording id. may be overwritten by params
     * @return
     */
    def ajaxGetSessionList(Long id) {

        //override parameter, if given
        if (!id && params.recording) {
            id = Long.parseLong(params.recording)
        }

        def recording = recordingService.get(id)

        def result = recording.annotationSessions.collect {session ->
            return sessionService.getUiStructure(session)
        }.sort {
            it.id
        }

        render result as JSON
    }


    def show(Long id) {

        // careful! manual multi tenancy

        Recording recording = recordingService.get(id)

        if (!recording) return notFound()

        def model = [recording: recording, isMine: recordingService.isMine(recording)]

        render view: "show", model: model
    }

/*
    def spotifyCallback() {

        println "spotifyCallback"
        println params

        def spotifyCredentials = [
            clientId: grailsApplication.config.getProperty("oma.spotify.clientId"),
            clientSecret: grailsApplication.config.getProperty("oma.spotify.clientSecret"),
            redirectUri: grailsApplication.config.getProperty("oma.spotify.redirectUri")
        ]

        def uri = 'https://accounts.spotify.com'

        def http = new HTTPBuilder()

        http.headers["Authorization"] = "Basic ${"$spotifyCredentials.clientId:$spotifyCredentials.clientSecret".bytes.encodeBase64()}"

        println http.headers

        http.post() {
            uri.path = "https://accounts.spotify.com/api/token"
            requestContentType = ContentType.JSON

            body = [
                form: [
                code: params.code,
                redirect_uri: "http://localhost:8080/recording/spotifyCallback", //spotifyCredentials.redirectUri,
                grant_type: 'authorization_code'
                ],
            ]

            response.success = { resp ->
                println "Success! ${resp.status}"
            }

            response.failure = { resp ->
                println "Request failed with status ${resp.status}"
            }

        }



        render "OK"

    }
*/

    GrailsApplication grailsApplication
    /*
    def spotify(Long id) {

        def spotifyCredentials = [
            clientId: grailsApplication.config.getProperty("oma.spotify.clientId"),
            clientSecret: grailsApplication.config.getProperty("oma.spotify.clientSecret"),
            redirectUri: grailsApplication.config.getProperty("oma.spotify.redirectUri")
        ]

        redirect(uri: "https://accounts.spotify.com/authorize", params:  [
            response_type: 'code',
            client_id: spotifyCredentials.clientId,
            scope: "user-read-private user-read-email",
            redirect_uri: "http://localhost:8080/recording/spotifyCallback", // spotifyCredentials.redirectUri,
            state: "jepzji5vceipn7gz"] )


        return



        // careful! manual multi tenancy

        Recording recording = recordingService.get(id)

        def model = [
            recording: recording,
            isMine: recordingService.isMine(recording),
        ]

        render view: "showSpotify", model: model
    }

     */





/*
    AnnotationStatisticsService annotationStatisticsService
    def getBeats(Long id) {

        def recording = Recording.get(id)

        def beats = recording.annotationSessions.find {
            it.title == "averageBeats"
        }

        if (!beats) {
            beats = recordingService.getBeats(recording)
            recording.addToAnnotationSessions(beats)
            if (!recording.save(flush: true)) {
                println recording.errors
                return null
            }
        }
        render beats as JSON
    }

    def getTempo(Long id) {

        def recording = Recording.get(id)

        def tempo = recording.annotationSessions.find {
            it.title == "Tempo"
        }

        if (!tempo) {
            tempo = recordingService.getTempo(recording)
            recording.addToAnnotationSessions(tempo)
            if (!recording.save(flush: true)) {
                println recording.errors
                return null
            }
        }
        render tempo as JSON
    }

    def deleteTempo(Long id) {
        def recording = Recording.get(id)


        def tempo = recording.annotationSessions.find {
            it.title == "Tempo"
        }

        if (tempo) {
            recording.removeFromAnnotationSessions(tempo)
            recording.tempo = null
            tempo.delete()
        }
        if (!recording.save(flush: true)) {
            println recording.errors
        }
        redirect(action: "show", id: id)
    }

    def deleteBeats(Long id) {

        println "deleteBeats"

        def recording = Recording.get(id)

        def beats = recording.annotationSessions.find {
            it.title == "averageBeats"
        }

        println beats

        if (beats) {
            def r = recording.removeFromAnnotationSessions(beats)
            recording.beats = null
            beats.delete()
            if (!recording.save(flush: true)) {
                println recording.errors
            }
        }

        redirect(action: "show", id: id)
    }


    def getBeatDescription() {
        println params

        // TODO: filtering of sessions. default: all sessions

        def recording = Recording.get(params.recording)

        def d = annotationStatisticsService.describeSessions(recording.annotationSessions)

        // println d

        render d as JSON

    }

 */



    def getPeaksFile(Long id) {
        println "getPeaksFile: " + id

        def recording = recordingService.get(id)
        if (!recording) return notFound()


        def file = recordingService.getPeaksFile(recording)
        if (!file) return notFound()


        response.setContentType("application/json")
        response.setHeader("Content-Disposition", "inline;Filename=\"${recording.id}.peaks.json\"")
        response.setHeader("Content-Length", file.size().toString())


        try {
            def outputStream = response.getOutputStream()
            outputStream << file.newInputStream()
            outputStream.flush()
            outputStream.close()
        } catch (Exception ex) {
            println ex.message
        }


    }

    def createPeaksFile(Long id) {
        def recording = Recording.get(id)
        if (!recording) return notFound()

        // load audio
        if (!params.type) {
            params.type = "mp3"
        }

        def file = recordingService.getFile(recording, params.type)

        if (!file) return notFound()

        println file.absolutePath

        // TODO: add to docker
        // feed to audiowaveform
        // https://github.com/bbc/audiowaveform


        def outputFileName = "/tmp/${recording.id}.peaks.json"

        // z factor limits
        def command = "audiowaveform -i ${file.absolutePath} -o ${outputFileName} -z 32 -b 8 --split-channels"

        def process = command.execute()
        def sout = new StringBuilder()
        def serr = new StringBuilder()
        process.consumeProcessOutput(sout, serr)
        process.waitForOrKill(60000)

        println "out> $sout"
        println "err> $serr"

        def outputLines = serr.toString().split("\n")
        outputLines.each { String line ->
            def lineParts = line.split(": ")
            if (lineParts.size() == 2) {
                def key = lineParts[0]
                def value = lineParts[1]
                recording.recordingData["audiowaveform-"+key] = value

            } else {
                println "cannot parse: " + line
            }

        }

        // recording.recordingData["peaksOut"] = sout.toString()
        // recording.recordingData["peaksErr"] = serr.toString()


        // save .dat and .json files containing waveform

        def result = recordingService.storePeaksFile(recording, new File(outputFileName))
        if (result.success) {
            println "result.success"
            recording.recordingData["peaksFile"] = result.success
            if (!recording.save(flush: true)) {
                println recording.errors
            }
        }

        return result


    }



    def uploadAudio(Recording recording) {
        respond(recording, view: "uploadAudio")
    }

    def uploadTapping(Recording recording) {
        respond(recording, view: "uploadTapping")
    }

    /**
     * fills JS search
     * @return searchBase
     */
    @Deprecated
    def getSearchBase() {
        def searchBase = []

        Recording.findAllByDigitalAudioIsNotEmpty().each {recording ->
            searchBase.add(
                [
                    id: recording.id,
                    name: recording.toString()
                ]
            )
        }
        //println searchBase
        render searchBase as JSON
    }


    /**
     * streams the primary audio file associated with recording
     * supports range header. use it!
     * @param id recording.id
     * @return
     */
    def getAudioFile(Long id) {

        def recording = recordingService.get(id)
        if (!recording) return notFound()

        def file = recordingService.getFile(recording, params.type)
        if (!file) return notFound()

        def outputStream
        try {
            outputStream = response.getOutputStream()
        } catch (Exception ex) {
            println "error getting output stream"
            println ex.message
        }

        def inputStream = file.newInputStream()
        // partial audio streaming with grails:
        // https://stackoverflow.com/questions/46310388/streaming-mp4-requests-via-http-with-range-header-in-grails

        // preparing headers
        response.reset()
        response.setContentType("audio/wav")
        response.setHeader( 'Accept-Ranges', 'bytes')
        response.setHeader("Content-Disposition", "inline;Filename=\"${file.name}\"")
        response.setHeader("Content-Transfer-Encoding", "binary")
        response.setStatus(206)

        Long bufferSize = 1 * 1024 * 1024 // 1 MB
        Long contentEnd = 0
        Long contentLength = 0
        Long totalFileBytes = file.size()
        Long rangeFrom = 0
        Long rangeTo = 0

        def range = request.getHeader("range")
        if (range) {
            //println range

            def rangeKeyParts = range.tokenize("=")
            def rangeParts = rangeKeyParts[1].tokenize("-")

            rangeFrom = Integer.parseInt(rangeParts[0])
            //println "start at byte: " + rangeFrom.toString()

            inputStream.skip(rangeFrom)

            // ignoring rangeEnd for now
            // no end defined, but we do not stream everything, only, say, 8MB,
            contentLength = totalFileBytes - rangeFrom

            assert (contentLength > 0)

            // stream at most bufferSize bytes
            contentEnd = Math.min(rangeFrom + contentLength, rangeFrom + bufferSize)
            contentLength = contentEnd - rangeFrom

            response.setHeader('Content-Range', "bytes ${rangeFrom}-${contentEnd - 1}/${totalFileBytes}")
            response.setHeader( 'Content-Length', "${contentLength}")

            byte[] ioBuffer = new byte[contentLength]
            inputStream.read(ioBuffer, 0, (int)contentLength)

            try {
                outputStream << ioBuffer
                outputStream.flush()
            } catch (Exception ex) {
                println ex.message
            } finally {
                try {
                    outputStream.close()
                } catch (Exception ex) {
                    println ex.message
                }
            }

        } else {
            // no range. stream the whole file
            response.setHeader("Content-Length", file.size().toString())
            outputStream << file.newInputStream()
            outputStream.flush()
            outputStream.close()
        }


    }




    def uploadTappingFile(TappingFileCommand cmd) {

        Recording recording = Recording.get(cmd.recordingId)
        if (!recording) return notFound()

        def session = tappingService.uploadFile(recording, cmd)

        flash.message = "Tapping uploaded: " + session.title
        redirect(controllerName: "recording", action: "show", id: recording.id)
    }


    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'recording.label', default: 'Recording'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }

    def index(Integer max) {

        render(view: "index", model:[recordingList: []])
    }


    def springSecurityService
    def ajaxIndex() {

        def recordingList = Recording.findAllByIsAuthored( true).collect {

            // println it

            return [
                id: it.id,
                // TODO: more readable data checks
                composerName: it.interpretation?.abstractMusicParts ? it.interpretation?.abstractMusicParts[0]?.abstractMusic?.composer?.toString() : null,
                abstractMusicTitle: it.interpretation?.abstractMusicParts ? it.interpretation?.abstractMusicParts[0]?.toString() : null,
                interpretationTitle: it.interpretation?.toString(),
                title: it.title
            ]
        }

        render recordingList as JSON
    }


    def share(Long id) {
        Recording recording = Recording.get(id)
        if (!recording) return notFound()

        recording.isShared = true
        recording.annotationSessions.each {
            it.isShared = true
        }
        if (!recording.save(flush: true)) {
            println recording.errors
            flash.message = recording.errors
        }

        redirect(action: "show", id: recording.id)
    }
    def unshare(Long id) {
        Recording recording = Recording.get(id)
        if (!recording) return notFound()

        recording.isShared = false
        recording.annotationSessions.each {
            it.isShared = false
        }
        if (!recording.save(flush: true)) {
            println recording.errors
            flash.message = recording.errors
        }

        redirect(action: "show", id: recording.id)
    }


    def create() {
        Recording dummyRecording = new Recording(title: "Add a Title or leave blank to use filename...", digitalAudio: [])
        // make sure the object is saved before we add audio file and stuff
        if (!dummyRecording.save(flush: true)) {
            println dummyRecording.errors
        }
        respond dummyRecording
    }

    /**
     * called upon update
     * @return
     */
    def update(Recording recording) {
        println "UPDATE"
        println params

        //def recording = Recording.get(params.id)
        if (recording == null) {
            notFound()
            return
        }

        try {
            recording.title = params.title
            recording.interpretation = Interpretation.get(params.interpretation.id)
            if (!recording.save(flush: true)) {
                println recording.errors
                respond recording.errors, view:'show'
                return
            }

            //recordingService.save(recording)
        } catch (Exception e) {
            respond recording.errors, view:'edit'
            return
        }

        println "redirecting to show after update"

        flash.message = message(code: 'default.updated.message', args: [message(code: 'recording.label', default: 'Recording'), recording.id])

        //render (view: "show", model: [recording: recording])
        redirect(action: "show", id: recording.id)
    }


    /**
     * called upon create
     * @return
     */
    def save() {
        println "SAVE"
        println params

        def recording = Recording.get(params.id)
        if (!recording) return notFound()

        if (!params.title || params.title == "") {
            params.title = recording.digitalAudio[0].originalFileName
        }

        try {


            recording.title = params.title
            //recording.interpretation = params.interpretation
            if (!recording.save(flush: true)) {
                println recording.errors
                respond recording.errors, view:'create'
                return
            }


            //recordingService.save(recording)
        } catch (Exception e) {
            respond recording.errors, view:'create'
            return
        }

        flash.message = message(code: 'default.updated.message', args: [message(code: 'recording.label', default: 'Recording'), recording.id])

        redirect(action: "show", id: recording.id)
    }

    def delete(Long id) {
        if (id == null) {
            notFound()
            return
        }

        def recording = Recording.get(id)
        if (!recording) return notFound()

        recording.digitalAudio.each {
            it.delete()
            println "delete audio"
        }

        recording.delete(flush: true)


        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'recording.label', default: 'Recording'), id])
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }
    }


}
