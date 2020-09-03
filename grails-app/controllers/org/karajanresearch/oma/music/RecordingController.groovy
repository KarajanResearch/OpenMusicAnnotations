package org.karajanresearch.oma.music

import grails.converters.JSON
import org.karajanresearch.oma.annotation.Annotation
import org.karajanresearch.oma.annotation.Session
import org.karajanresearch.oma.annotation.desc.AnnotationStatisticsService
import org.karajanresearch.oma.api.AnnotationApiService
import org.springframework.web.multipart.MultipartFile

import static org.springframework.http.HttpStatus.*
import grails.plugin.springsecurity.annotation.Secured


@Secured("ROLE_AUTHENTICATED")
class RecordingController {

    static scaffold = Recording


    def recordingService
    def tappingService


    /**
     * AJAX call from dropzone in create.gsp to add wav file
     * encapsulated as DigitalAudioCommand
     */
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
        if (!annotation) return notFound()

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

    def ajaxDeleteAnnotation() {
        println "ajaxDeleteAnnotation"
        println params

        def annotation = Annotation.get(params.annotation)

        if (!annotation) return notFound()

        /*
        def session = annotation.session
        session.removeFromAnnotations(annotation)
        if (!session.save(flush: true)) {
            println session.errors
        }


         */
        // FIXME: delete does not work
        try {
            annotation.delete(flush: true)
        } catch (Exception ex) {
            println ex.message
        }

        def result = [success: "Alright"]
        render result as JSON



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

    /**
     * called from sheetMusicPlayer
     * @return
     */
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

    /**
     * called from sheetMusicPlayer
     * @return
     */
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


    def ajaxGetSessionList() {
        println "ajaxGetSessionList"
        println params

        def recording = Recording.get(params.recording)

        def result = recording.annotationSessions
        render result as JSON
    }

    def ajaxGetSession() {
        println "ajaxGetSession"
        println params

        if (params.session == "null" || params.session == "-1") {
            render ([error: "no session"]) as JSON
            return
        }

        Session session = Session.get(params.session)
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

    def vizPlayFrame(Long id) {
        def recording = Recording.get(id)

        if (!recording) {
            return notFound()
        }

        def model = [recording: recording]

        //render model as JSON

        render view: "vizPlayFrame", model: model
    }

    def show(Long id) {
        def recording = Recording.get(id)

        if (!recording) {
            return notFound()
        }
        def showScore = false
        /*
        if (recording?.abstractMusicPart?.pdfLocation) {
            showScore = true
        }
         */

        def model = [recording: recording, showScore: showScore]

        //render model as JSON

        render view: "show", model: model
    }


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


    /**
     * create all missing peaks.json files for waveform rendering
     * @return
     */
    def createAllPeaksFiles() {

        Recording.list().each { recording ->
            //if (!recording.recordingData.peaksFile) {
                println createPeaksFile(recording.id)
            //}
        }

    }

    def getPeaksFile(Long id) {

        def recording = Recording.get(id)
        if (!recording) return notFound()


        def file = recordingService.getPeaksFile(recording)
        if (!file) return notFound()


        response.setContentType("application/json")
        response.setHeader("Content-Disposition", "inline;Filename=\"${recording.id}.peaks.json\"")
        //response.setHeader("Content-Transfer-Encoding", "binary")
        //response.setHeader("Content-Length", file.size().toString())


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


    def getAudioFile(Long id) {

        println "getAudioFile " + new Date()
        println params


        def recording = Recording.get(id)

        if (!recording) return notFound()


        def file = recordingService.getFile(recording, params.type)

        if (!file) return notFound()



        println "Response Buffer Size: " +  response.getBufferSize()
//        response.setBufferSize(1024 * 1024)
        // Integer fileSize = file.size()
        // response.setBufferSize(fileSize)

        // println "Increased Buffer Size: " +  response.getBufferSize()
        println "File size: " + file.size()

        try {
            response.setContentType("audio/wav")
            response.setHeader("Content-Length", file.size().toString())
        } catch(Exception ex) {
            println ex.message
        }


        // https://stackoverflow.com/questions/46310388/streaming-mp4-requests-via-http-with-range-header-in-grails

        println "request header:"
        def range = request.getHeader("range")
        if (range) {
            println range

            def rangeKeyParts = range.tokenize("=")
            def rangeParts = rangeKeyParts[1].tokenize("-")

            // TODO: fix partial streaming, if necessary
            if (rangeParts.size() > 1) {
                Integer startByte = Integer.parseInt(rangeParts[0])
                Integer endByte = Integer.parseInt(rangeParts[1])
                //Integer contentLength = (endByte)
            }
        }

        response.setHeader( 'Accept-Ranges', 'bytes')

        //response.setHeader("Content-Disposition", "inline;Filename=\"${fileName}\"")
        //response.setHeader("Content-Transfer-Encoding", "binary")

        def outputStream = response.getOutputStream()
        try {
            //def outputStream = response.getOutputStream()
            outputStream << file.newInputStream()
            outputStream.flush()

        } catch (Exception ex) {
            println ex.message
            // println ex.stackTrace.toString()
        } finally {

            try {
                outputStream.close()
            } catch (Exception ex) {
                println "Outputstream not closed properly"
                println ex.message
            }

        }

    }






    def uploadTappingFile(TappingFileCommand cmd) {


        Recording recording = Recording.get(cmd.recordingId)
        if (!recording) return notFound()

        recording = tappingService.uploadFile(recording, cmd)

        flash.message = "Tapping uploaded"
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
        def namedParams = [:]
        def options  = [:]

        if (max) {
            options.max = max
        }

        def recordingList = Recording.executeQuery("""
            select r.id, r.title, i.title, am.title, c.name, count(s)
            from Recording r
            left join r.interpretation as i
            left join i.abstractMusicParts as amp
            left join amp.abstractMusic as am
            left join am.composer as c
            left join r.annotationSessions as s
            group by r.id, i.id, amp.id, am.id, c.id
            """, namedParams, options
        ) // TODO: use collect() when refactoring in the future
        render(view: "index", model:[recordingList: recordingList])
    }


    def create() {

        Recording dummyRecording = new Recording(title: "Add a Title or leave blank to use filename...", digitalAudio: [])


        if (!dummyRecording.save(flush: true)) {
            println dummyRecording.errors
        }

        respond dummyRecording
    }

    def update(Recording recording) {
        println "SAVE"
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

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'recording.label', default: 'Recording'), recording.id])
                redirect (view: "show", model: recording)
            }
            '*'{ respond recording, [status: OK] }
        }
    }


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

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.created.message', args: [message(code: 'recording.label', default: 'Recording'), recording.id])
                redirect recording
            }
            '*' { respond recording, [status: CREATED] }
        }
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



    /*

    RecordingService recordingService

    static allowedMethods = [save: "POST", update: "PUT", delete: "DELETE"]

    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond recordingService.list(params), model:[recordingCount: recordingService.count()]
    }

    def show(Long id) {
        respond recordingService.get(id)
    }

    def create() {
        respond new Recording(params)
    }

    def save(Recording recording) {
        if (recording == null) {
            notFound()
            return
        }

        try {
            recordingService.save(recording)
        } catch (ValidationException e) {
            respond recording.errors, view:'create'
            return
        }

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.created.message', args: [message(code: 'recording.label', default: 'Recording'), recording.id])
                redirect recording
            }
            '*' { respond recording, [status: CREATED] }
        }
    }

    def edit(Long id) {
        respond recordingService.get(id)
    }

    def update(Recording recording) {
        if (recording == null) {
            notFound()
            return
        }

        try {
            recordingService.save(recording)
        } catch (ValidationException e) {
            respond recording.errors, view:'edit'
            return
        }

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'recording.label', default: 'Recording'), recording.id])
                redirect recording
            }
            '*'{ respond recording, [status: OK] }
        }
    }

    def delete(Long id) {
        if (id == null) {
            notFound()
            return
        }

        recordingService.delete(id)

        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.deleted.message', args: [message(code: 'recording.label', default: 'Recording'), id])
                redirect action:"index", method:"GET"
            }
            '*'{ render status: NO_CONTENT }
        }
    }

    protected void notFound() {
        request.withFormat {
            form multipartForm {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'recording.label', default: 'Recording'), params.id])
                redirect action: "index", method: "GET"
            }
            '*'{ render status: NOT_FOUND }
        }
    }*/
}
