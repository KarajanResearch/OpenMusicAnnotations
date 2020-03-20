package org.karajanresearch.oma.music

import grails.converters.JSON
import org.karajanresearch.oma.annotation.Annotation
import org.karajanresearch.oma.annotation.Session
import org.karajanresearch.oma.annotation.desc.AnnotationStatisticsService
import org.karajanresearch.oma.api.AnnotationApiService
import org.springframework.web.multipart.MultipartFile

import static org.springframework.http.HttpStatus.*
import grails.plugin.springsecurity.annotation.Secured


@Secured("ROLE_ADMIN")
class RecordingController {

    static scaffold = Recording


    def recordingService
    def tappingService


    /**
     * called from recording.show view
     * @return
     */
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


    def show(Long id) {
        def recording = Recording.get(id)

        if (!recording) {
            return notFound()
        }


        def annotationSessions = [:]


        if (!recording.beats) {
            println "No beats stats. crating..."
            recording.beats = recordingService.getBeats(recording)
            if (!recording.save(flush: true)) {
                println recording.errors
            }
        }

        annotationSessions["averageBeats"] = recording.beats

        JSON.use("deep")
        def annotationSessionsJson = annotationSessions as JSON


        def model = [recording: recording, annotationSessionsJson: annotationSessionsJson]

        //render model as JSON

        //render view: "show", model: model
        render view: "vizPlay", model: model
    }


    def vizPlay(Long id) {
        def recording = Recording.get(id)

        def annotationSessions = Session.findAllByRecording(recording)

        JSON.use("deep")
        def annotationSessionsJson = annotationSessions as JSON


        def model = [recording: recording, annotationSessionsJson: annotationSessionsJson]

        //render model as JSON

        render view: "vizPlay", model: model
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
            if (!recording.recordingData.peaksFile) {
                println createPeaksFile(recording.id)
            }
        }

    }

    def getPeaksFile(Long id) {

        def recording = Recording.get(id)
        if (!recording) return notFound()


        def file = recordingService.getPeaksFile(recording)


        response.setContentType("application/json")
        response.setHeader("Content-Disposition", "inline;Filename=\"${recording.id}.peaks.json\"")
        //response.setHeader("Content-Transfer-Encoding", "binary")
        //response.setHeader("Content-Length", file.size().toString())


        def outputStream = response.getOutputStream()
        outputStream << file.newInputStream()
        outputStream.flush()
        outputStream.close()



    }

    def createPeaksFile(Long id) {
        def recording = Recording.get(id)
        if (!recording) return notFound()

        // load audio
        if (!params.type) {
            params.type = "wav"
        }

        def file = recordingService.getFile(recording, params.type)

        if (!file) return notFound()

        println file.absolutePath

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

        println "out> $sout err> $serr"


        // save .dat and .json files containing waveform

        def result = recordingService.storePeaksFile(recording, new File(outputFileName))
        if (result.success) {
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

/*
    def stream(Long id) {

        def recording = Recording.get(id)

        if (!recording) return

        def file = recordingService.getFile(recording)

        if (!file) return

        response.setContentType("APPLICATION/OCTET-STREAM")
        response.setHeader("Content-Disposition", "Attachment;Filename=\"${f.name}\"")

        def outputStream = response.getOutputStream()
        outputStream << file.newInputStream()
        outputStream.flush()
        outputStream.close()
    }
*/

    def getAudioFile(Long id) {

        println "getAudioFile"
        println params


        def recording = Recording.get(id)

        if (!recording) return notFound()

        if (!params.type) {
            params.type = "mp3"
        }

        def file = recordingService.getFile(recording, params.type)

        if (!file) return notFound()


        response.setContentType("APPLICATION/OCTET-STREAM")
        response.setHeader("Content-Disposition", "inline;Filename=\"${file.name}\"")
        response.setHeader("Content-Transfer-Encoding", "binary")
        response.setHeader("Content-Length", file.size().toString())


        def outputStream = response.getOutputStream()
        outputStream << file.newInputStream()
        outputStream.flush()
        outputStream.close()

    }



    def uploadRecordingFile(RecordingFileCommand cmd) {


        Recording recording = Recording.get(cmd.recordingId)
        if (!recording) return notFound()

        recording = recordingService.uploadFile(recording, cmd)

        flash.message = "Audio uploaded"
        redirect(controllerName: "recording", action: "show", id: recording.id)
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
        )
        render(view: "index", model:[recordingList: recordingList])
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
