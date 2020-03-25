package org.karajanresearch.oma.music

import com.amazonaws.services.s3.model.CannedAccessControlList
import grails.gorm.transactions.Transactional
import grails.util.Environment
import org.karajanresearch.oma.StorageBackendService
import org.karajanresearch.oma.annotation.Annotation
import org.karajanresearch.oma.annotation.Session
import org.karajanresearch.oma.annotation.desc.AnnotationStatisticsService
import org.springframework.web.multipart.MultipartFile

import java.nio.file.Files

@Transactional
class RecordingService {
/*
    Recording get(Serializable id)

    List<Recording> list(Map args)

    Long count()

    void delete(Serializable id)

    Recording save(Recording recording)
*/

    StorageBackendService storageBackendService
    RecordingGormService recordingGormService


    AnnotationStatisticsService annotationStatisticsService

    Session getBeats(Recording recording) {

        def averageBeats = annotationStatisticsService.describeSessions(recording.annotationSessions)



        Session session = new Session( title: "averageBeats", annotations: [], recording: recording)

        /**
         * describedBeats[barNum][beatNum]["avg"] = average
         *                 describedBeats[barNum][beatNum]["std"] = stddev
         */
        averageBeats.each { bar, beats ->
            //println bar
            beats.each { beat, stat ->
                //println beat

                session.addToAnnotations(
                    new Annotation(type: "beat",
                        momentOfPerception: stat["avg"],
                        barNumber: bar,
                        beatNumber: beat
                    )
                )
            }
        }

        return session
    }

    Session getTempo(Recording recording) {


        Session beatBars = getBeats(recording)

        def lastTime = 0.0

        Session tempo = new Session(title: "Tempo", annotations: [])

        beatBars.annotations.each { Annotation beat ->
            //println beat.momentOfPerception

            def diff = beat.momentOfPerception - lastTime
            lastTime = beat.momentOfPerception

            def currentTempo = 60 / diff

            // println currentTempo
            tempo.addToAnnotations(new Annotation(
                type: "CurrentTempo",
                momentOfPerception: beat.momentOfPerception,
                doubleValue: currentTempo
            ))

        }


        return tempo
    }


    File getPeaksFile(Recording recording) {

        def location = recording.recordingData["peaksFile"]
        if (!location) return null

        File file = File.createTempFile("peaks-" + recording.id.toString(), ".json")


        def keyPath = storageBackendService.getS3Key(location)
        def bucket = storageBackendService.getS3Bucket(location)

        println keyPath
        println bucket


        def f = storageBackendService.getFile(bucket, keyPath, file.absolutePath)

        println f

        return f

    }

    /**
     *
     * @param recording
     * @param type wav, mp3, flac, ...
     * @return
     */
    File getFile(Recording recording, String type) {



        File file = File.createTempFile("recording-" + recording.id.toString() + "-","."+type)


        if (!recording.digitalAudio || !recording.digitalAudio[0] || !recording.digitalAudio[0].location) return null


        def audioFile = recording.digitalAudio.find { DigitalAudio digitalAudio ->
            digitalAudio.originalFileName.endsWith(type)
        }

        if (!audioFile) return null

        def location = audioFile.location

        println "location: " + location


        def keyPath = storageBackendService.getS3Key(location)
        def bucket = storageBackendService.getS3Bucket(location)

        println keyPath
        println bucket


        def f = storageBackendService.getFile(bucket, keyPath, file.absolutePath)

        println f

        return file
    }

    def storePeaksFile(Recording recording, File peaksFile) {

        // store to s3 if it is a new file
        def env = Environment.current.name.replace(" ", "-")
        def prefix = "${env}/recording/${recording.id}"
        String path = "${prefix}/peaks.json"

        String s3FileUrl = storageBackendService.storeFile(
            storageBackendService.BUCKET_NAME,
            path,
            peaksFile,
            CannedAccessControlList.Private
        )

        println "S3: " + s3FileUrl

        if (!s3FileUrl) {
            println "S3 save error: Recording"
            return [error: "S3 save error: Recording"]
        }

        return [success: s3FileUrl]
    }


    /**
     * wav files via dropzone
     * @param recording
     * @param digitalAudioCommand
     * @return
     */
    Recording storeDigitalAudio(Recording recording, DigitalAudioCommand digitalAudioCommand) {

        def tempFile = File.createTempFile("digitalAudio", ".wav")

        println tempFile.absolutePath

        digitalAudioCommand.file.transferTo(tempFile)



        def fileName = digitalAudioCommand.file.originalFilename
        fileName = fileName.replace("\\", "/")
        def fileNameParts = fileName.split("/")
        fileName = fileNameParts[fileNameParts.size()-1]

        println fileName

        // create beats file
        def tempPeaksFile = File.createTempFile("peaks", ".json")
        println tempPeaksFile.absolutePath

        // z factor limits zoom level
        def command = "audiowaveform -i ${tempFile.absolutePath} -o ${tempPeaksFile.absolutePath} -z 32 -b 8 --split-channels"

        def process = command.execute()
        def sout = new StringBuilder()
        def serr = new StringBuilder()
        process.consumeProcessOutput(sout, serr)
        process.waitForOrKill(60000)

        println "out> $sout err> $serr"


        // save .dat and .json files containing waveform

        def result = storePeaksFile(recording, tempPeaksFile)
        if (result.success) {
            recording.recordingData["peaksFile"] = result.success
            if (!recording.save(flush: true)) {
                println recording.errors
            }
        }



        // save to S3
        // store to s3 if it is a new file
        def env = Environment.current.name.replace(" ", "-")
        def prefix = "${env}/recording/${recording.id}"
        def path = "${prefix}/${fileName}"

        println storageBackendService.BUCKET_NAME
        println path

        def bucket = "open-music-annotations-storage-backend"

        String s3FileUrl = storageBackendService.storeFile(
            bucket,
            path,
            tempFile,
            CannedAccessControlList.Private
        )

        println "S3: " + s3FileUrl

        if (!s3FileUrl) {
            println "S3 save error: Recording"
            return recording
        }

        def digitalAudio = new DigitalAudio(recording: recording)
        digitalAudio.location = s3FileUrl
        digitalAudio.originalFileName = fileName
        digitalAudio.contentType = digitalAudioCommand.file.contentType
        recording.addToDigitalAudio(digitalAudio)
        // recording.version = cmd.version

        //statement.statementDocumentUrl = statementDocumentUrl
        //statement.statementDocumentContentType = contentType
        if (!recording.save(flush: true)) {
            println recording.errors
            return null
        }

        return recording
    }

    /**
     * Deprecated
     * @param recording
     * @param cmd
     * @return
     */
    Recording uploadFile(Recording recording, RecordingFileCommand cmd) {

        // parse filename
        def fileName = cmd.recordingFile.originalFilename
        //fileName = fileName.replace('[', "_")
        //fileName = fileName.replace("]", "_")
        //fileName = fileName.replace(" ", "_")
        fileName = fileName.replace("\\", "/")
        def fileNameParts = fileName.split("/")
        //println fileNameParts
        fileName = fileNameParts[fileNameParts.size()-1]

        DigitalAudio exists = DigitalAudio.findByRecordingAndOriginalFileName(
            recording, fileName
        )

        if (exists) {
            println "File exists"
            return recording
        }

        // store to s3 if it is a new file
        def env = Environment.current.name.replace(" ", "-")
        def prefix = "${env}/recording/${recording.id}"
        def path = "${prefix}/${fileName}"

        println storageBackendService.BUCKET_NAME
        println path

        def bucket = "open-music-annotations-storage-backend"

        String s3FileUrl = storageBackendService.storeMultipartFile(
            bucket,
            path,
            cmd.recordingFile,
            CannedAccessControlList.Private
        )

        println "S3: " + s3FileUrl

        if (!s3FileUrl) {
            println "S3 save error: Recording"
            return recording
        }

        def digitalAudio = new DigitalAudio(recording: recording)
        digitalAudio.location = s3FileUrl
        digitalAudio.originalFileName = fileName
        digitalAudio.contentType = cmd.recordingFile.contentType
        recording.addToDigitalAudio(digitalAudio)
        recording.version = cmd.version

        //statement.statementDocumentUrl = statementDocumentUrl
        //statement.statementDocumentContentType = contentType
        if (!recording.save(flush: true)) {
            println recording.errors
            return null
        }

        return recording
    }
}