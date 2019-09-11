package oma

import grails.gorm.services.Service
import grails.util.Environment
import groovyx.net.http.HTTPBuilder
import groovyx.net.http.Method

@Service(Recording)
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


    File getFile(Recording recording) {


        println "getting file from: " + recording.digitalAudio.location

        // check location for download
        def uri = recording.digitalAudio.location

        def http = new HTTPBuilder(uri)

        def result = http.request(Method.GET) {
            println it
        }

        return result

    }


    Recording uploadFile(Recording recording, RecordingFileCommand cmd) {

        def env = Environment.current.name.replace(" ", "-")
        def prefix = "${env}/recording/${recording.id}/${new Date().format("yyyy-MM-dd-hh-mm-SS")}"
        def path = "${prefix}_${cmd.recordingFile.originalFilename}"

        println storageBackendService.BUCKET_NAME
        println path
        

        String s3FileUrl = storageBackendService.storeMultipartFile(path, cmd.recordingFile.originalFilename, cmd.recordingFile)

        println s3FileUrl

        //TODO: does not work

        if (!s3FileUrl) return recording


        return recordingGormService.updateRecordingFile(recording.id, cmd.version, s3FileUrl, cmd.recordingFile.contentType)

    }
}