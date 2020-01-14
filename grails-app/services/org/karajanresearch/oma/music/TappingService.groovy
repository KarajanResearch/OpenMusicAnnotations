package org.karajanresearch.oma.music


import grails.gorm.transactions.Transactional
import grails.util.Environment
import org.karajanresearch.oma.StorageBackendService
import org.karajanresearch.oma.annotation.Annotation
import org.karajanresearch.oma.annotation.Session
import org.karajanresearch.oma.music.Recording
import org.karajanresearch.oma.music.TappingFileCommand


@Transactional
class TappingService {

    StorageBackendService storageBackendService


    def uploadFile(Recording recording, TappingFileCommand cmd) {

        def env = Environment.current.name.replace(" ", "-")
        def prefix = "${env}/recording/${recording.id}/${new Date().format("yyyy-MM-dd-hh-mm-SS")}"

        def fileName = cmd.tappingFile.originalFilename
        fileName = fileName.replace('[', "_")
        fileName = fileName.replace("]", "_")
        fileName = fileName.replace(" ", "_")
        fileName = fileName.replace("\\", "/")
        def fileNameParts = fileName.split("/")
        //println fileNameParts
        fileName = fileNameParts[fileNameParts.size()-1]

        def path = "${prefix}_tapping_${fileName}"

        println storageBackendService.BUCKET_NAME
        println path

        def bucket = "open-music-annotations-storage-backend"
        /*
        String s3FileUrl = storageBackendService.storeMultipartFile(
            bucket,
            path,
            cmd.tappingFile,
            CannedAccessControlList.Private
        )

        println "S3: " + s3FileUrl

        if (!s3FileUrl) return recording
*/

        // process data

        Session session = Session.findOrSaveWhere(recording: recording, title: "Upload of " + fileName)

        if (session.annotations) {
            session.annotations.each {
                session.removeFromAnnotations(it)
            }
        }

        cmd.tappingFile.inputStream.readLines().each { line ->

            //TODO: check separator
            //def supportedSeperators = [",", "\t"]
            line = line.replace(",", "\t")

            def parts = line.tokenize("\t")

            try {
                def timestamp = Double.parseDouble(parts[0])
                def beatbar = parts[1].tokenize(".")  // the comma is no comma
                Long bar = Long.parseLong(beatbar[0])
                Long beat = Long.parseLong(beatbar[1])

                def a = new Annotation(
                    momentOfPerception: timestamp,
                    type: "Tap",
                    barNumber: bar,
                    beatNumber: beat
                )
                session.addToAnnotations(a)

                println a
            } catch (Exception ex) {
                println ex.message

            }



        }

        session.save(flush: true)


        return session

    }
}
