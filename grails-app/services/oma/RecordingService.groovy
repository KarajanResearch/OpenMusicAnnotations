package oma

import com.amazonaws.services.s3.model.CannedAccessControlList
import grails.gorm.services.Service
import grails.util.Environment

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



        File file = File.createTempFile("temp",".mp3")

        if (!recording.digitalAudio || !recording.digitalAudio[0] || !recording.digitalAudio[0].location) return null

        def location = recording.digitalAudio[0].location

        def keyPath = storageBackendService.getS3Key(location)
        def bucket = storageBackendService.getS3Bucket(location)

        println keyPath
        println bucket



        def f = storageBackendService.getFile(bucket, keyPath, file.absolutePath)

        println f

        return file


    }


    Recording uploadFile(Recording recording, RecordingFileCommand cmd) {

        def env = Environment.current.name.replace(" ", "-")
        def prefix = "${env}/recording/${recording.id}/${new Date().format("yyyy-MM-dd-hh-mm-SS")}"
        def path = "${prefix}_${cmd.recordingFile.originalFilename}"

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

        if (!s3FileUrl) return recording

        return recordingGormService.updateRecordingFile(recording.id, cmd.version, s3FileUrl, cmd.recordingFile.contentType)

    }
}