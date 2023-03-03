package org.karajanresearch.oma.music

import grails.core.GrailsApplication
import grails.gorm.multitenancy.WithoutTenant
import grails.gorm.transactions.Transactional
import grails.plugin.springsecurity.SpringSecurityService
import grails.util.Environment
import org.karajanresearch.oma.StorageBackendService
import org.karajanresearch.oma.annotation.Annotation
import org.karajanresearch.oma.annotation.Session
import org.karajanresearch.oma.annotation.SessionService
import org.karajanresearch.oma.annotation.desc.AnnotationStatisticsService
import pl.touk.excel.export.XlsxExporter
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream

@Transactional
class RecordingService {


    SessionService sessionService
    def bundleDownload(recordings, String format) {
        // create zip file
        File.createTempFile("KarajanResearchDataset", ".zip").with {zipFile ->
            deleteOnExit()

            ZipOutputStream zipOutput = new ZipOutputStream(zipFile.newOutputStream())

            // add files to zip
            // add excel file

            recordings.each { recording ->

                // a file per session
                recording.annotationSessions.each {session ->

                    File file

                    if (format == 'xlsx') {
                        file = sessionService.getExcelFile(session)
                    } else {
                        file = sessionService.getCsvFile(session)
                    }


                    def parts = file.absolutePath.tokenize('.')
                    def extension = parts.last()


                    def zipEntryName =
                        "sessionId-" + session.id.toString() + "." + extension


                    zipOutput.putNextEntry(new ZipEntry(zipEntryName))

                    Path input = Paths.get(file.absolutePath)

                    Files.copy(input, zipOutput)
                    zipOutput.closeEntry()

                }
            }


            def excelFile = File.createTempFile("metadata-", ".xlsx")
            // excel file


            def excelFileData = []
            recordings.each{
                it.annotationSessions.each { session ->
                    excelFileData.push([
                        sessionId: session.id,
                        composer: session.recording.interpretation.abstractMusicParts[0].abstractMusic.composer.name,
                        work: session.recording.interpretation.abstractMusicParts[0].abstractMusic.toString(),
                        part: session.recording.interpretation.abstractMusicParts[0].title,
                        interpretationTitle: session.recording.interpretation.toString()
                    ])
                }
            }

            def headers = []
            headers.addAll(excelFileData[0].keySet())

            new XlsxExporter().with {
                sheet("CsvFileDescription").with {
                    fillHeader(headers)
                    add(excelFileData, headers)
                }
                save(excelFile.newOutputStream())
            }


            zipOutput.putNextEntry(new ZipEntry("DatasetDescription.xlsx"))
            Path input = Paths.get(excelFile.absolutePath)
            Files.copy(input, zipOutput)
            zipOutput.closeEntry()


            zipOutput.close()


            return zipFile
        }
    }




/*
    Recording get(Serializable id)

    List<Recording> list(Map args)

    Long count()

    void delete(Serializable id)

    Recording save(Recording recording)

    @WithoutTenant
    Recording multiTenantManagedGet(Long id) {
        def recording = Recording.findByIdAndTenantId(id, springSecurityService.principal.id)

        if (!recording) {

            // not result? try shared Recordings
            recording = Recording.findByIdAndIsShared(id, true)
        }
        return recording
    }
*/

    StorageBackendService storageBackendService
    GrailsApplication grailsApplication
    AnnotationStatisticsService annotationStatisticsService
    SpringSecurityService springSecurityService

    @WithoutTenant
    Recording get(Serializable id) {
        def recording = Recording.findByIdAndTenantId(id, springSecurityService.principal.id)
        if (!recording) {
            // not result? try shared Recordings
            recording = Recording.findByIdAndIsShared(id, true)
        }
        return recording
    }



    Boolean isMine(Recording recording) {
        if (!recording) return false
        return springSecurityService.principal.id == recording.tenantId
    }


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


        // select digital audio. defaults to the first
        DigitalAudio digitalAudio = recording.digitalAudio[0]

        if (!digitalAudio) {
            println "No digital audio for recording: " + recording
            return null
        }


        switch (Environment.current) {
            case Environment.DEVELOPMENT:
                def path = grailsApplication.config.getProperty("oma.dataDirectory.development")
                path = path + "/digitalAudio/${digitalAudio.id}"
                // create beats file
                def peaksFile = new File(path, "${digitalAudio.id}-peaks.json")
                return peaksFile
                break
            case Environment.PRODUCTION:
                def path = grailsApplication.config.getProperty("oma.dataDirectory.production")
                path = path + "/digitalAudio/${digitalAudio.id}"
                // create beats file
                def peaksFile = new File(path, "${digitalAudio.id}-peaks.json")
                return peaksFile
                break
        }




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

        // select digital audio. defaults to the first
        DigitalAudio digitalAudio = recording.digitalAudio[0]
        // TODO: type-selection?


        return new File(digitalAudio.location)
    }


    /**
     * takes an audio file and creates a data file for peaks.js
     * This is a little bit tricky, because the tool from peaks.js,
     * called audiowaveform, is a CLI tool not available in a typical
     * java web container. Development mode is easy. Just install
     * audiowaveform in PATH on the development machine. Production
     * mode requires more work. We run a dedicated host to perform
     * CLI/Linux tasks on the OMA database and data directory.
     * We use python to wrap CLI/Linux tasks and everything that
     * cannot be done with a JVM.
     * See src/main/python
     * @param digitalAudio
     * @return
     */
    def createPeaksFile(DigitalAudio digitalAudio) {

        switch (Environment.current) {
            case Environment.DEVELOPMENT:

                def path = grailsApplication.config.getProperty("oma.dataDirectory.development")
                path = path + "/digitalAudio/${digitalAudio.id}"
                // create beats file
                def peaksFile = new File(path, "${digitalAudio.id}-peaks.json")
                println peaksFile.absolutePath
                println digitalAudio.location

                // z factor limits zoom level
                def command = "audiowaveform -i ${digitalAudio.location} -o ${peaksFile.absolutePath} -z 32 -b 8 --split-channels"

                println command

                def process = command.execute()
                def sout = new StringBuilder()
                def serr = new StringBuilder()
                process.consumeProcessOutput(sout, serr)
                process.waitForOrKill(60000)

                println "out> $sout err> $serr"

                break
            case Environment.PRODUCTION:
                // TODO: implement production in middleware. right now we rely on separate service
                // Note: file will be created at linux machine attached to EFS
                // production needs cron job for src/main/python/oma/task/digitalAudio.py
                // println "Make sure there is a cron job for src/main/python/oma/task/digitalAudio.py"
                break
        }
    }



    /**
     * wav files via dropzone
     * @param recording
     * @param digitalAudioCommand
     * @return
     */
    Recording storeDigitalAudio(Recording recording, DigitalAudioCommand digitalAudioCommand) {


        // prepare digital audio domain object
        def digitalAudio = new DigitalAudio(recording: recording)
        digitalAudio.location = "transient"
        digitalAudio.originalFileName = digitalAudioCommand.file.originalFilename
        digitalAudio.contentType = digitalAudioCommand.file.contentType

        if (!digitalAudio.save(flush: true)) {
            println digitalAudio.errors
            return null
        }


        // prepare storage path

        String path

        switch (Environment.current) {
            case Environment.DEVELOPMENT:
                path = grailsApplication.config.getProperty("oma.dataDirectory.development")
                break
            case Environment.PRODUCTION:
                path = grailsApplication.config.getProperty("oma.dataDirectory.production")
                break
        }

        println digitalAudio.id

        path = path + "/digitalAudio/${digitalAudio.id}"

        println path

        def dir = new File(path)
        if (!dir.exists()) {
            dir.mkdirs()
        }


        File target = new File(dir, "${digitalAudio.id}.wav")

        if (target.exists()) {
            println "file exists. TODO: handle this case"
            return recording
        } else {
            target.createNewFile()
        }

        if (!target.exists()) {
            println "file not created. TODO: handle this case"
            return recording
        }


        digitalAudioCommand.file.transferTo(target)

        digitalAudio.location = target.absolutePath
        if (!digitalAudio.save(flush: true)) {
            println digitalAudio.errors
            return null
        }

        recording.addToDigitalAudio(digitalAudio)

        if (!recording.save(flush: true)) {
            println recording.errors
            return null
        }


        // create peaks.js data file
        createPeaksFile(digitalAudio)

        return recording

    }


}