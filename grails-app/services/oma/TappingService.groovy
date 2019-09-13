package oma

import com.amazonaws.services.s3.model.CannedAccessControlList
import grails.gorm.transactions.Transactional
import grails.util.Environment
import oma.annotation.Annotation
import oma.annotation.Session


@Transactional
class TappingService {

    StorageBackendService storageBackendService


    def uploadFile(Recording recording, TappingFileCommand cmd) {

        def env = Environment.current.name.replace(" ", "-")
        def prefix = "${env}/recording/${recording.id}/${new Date().format("yyyy-MM-dd-hh-mm-SS")}"
        def path = "${prefix}_tapping_${cmd.tappingFile.originalFilename}"

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

        Session session = new Session(recording: recording, title: "Upload of " + cmd.tappingFile.name)

        cmd.tappingFile.inputStream.readLines().each { line ->

            //TODO: check separator
            //def supportedSeperators = [",", "\t"]
            line = line.replace(",", "\t")

            def parts = line.tokenize("\t")

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


        }

        session.save()




        return recording

    }
}
