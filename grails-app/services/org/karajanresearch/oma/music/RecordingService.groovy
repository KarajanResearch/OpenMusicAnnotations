package org.karajanresearch.oma.music

import com.amazonaws.services.s3.model.CannedAccessControlList
import grails.gorm.transactions.Transactional
import grails.util.Environment
import org.karajanresearch.oma.StorageBackendService
import org.karajanresearch.oma.annotation.Annotation
import org.karajanresearch.oma.annotation.Session
import org.karajanresearch.oma.annotation.desc.AnnotationStatisticsService
import org.springframework.web.multipart.MultipartFile

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