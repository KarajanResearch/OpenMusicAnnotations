package org.karajanresearch.oma.api

import com.amazonaws.services.s3.model.CannedAccessControlList
import grails.gorm.transactions.Transactional
import grails.util.Environment
import org.karajanresearch.oma.StorageBackendService
import org.karajanresearch.oma.music.DigitalAudio
import org.karajanresearch.oma.music.Recording
import org.karajanresearch.oma.music.RenderedImageSample

import org.karajanresearch.oma.music.RenderedWaveForm

@Transactional
class RenderedImageApiService {


    StorageBackendService storageBackendService


    File getFile(RenderedImageSample sample) {

        File file = File.createTempFile("image-" + sample.id.toString() + "-",".png")

        if (!sample.location) return null

        println "location: " + sample.location


        def keyPath = storageBackendService.getS3Key(sample.location)
        def bucket = storageBackendService.getS3Bucket(sample.location)

        println keyPath
        println bucket
        def f = storageBackendService.getFile(bucket, keyPath, file.absolutePath)
        return file
    }



    def addToRecording(params) {


        Recording recording = Recording.get(params.recording)

        if (!recording) {
            return ["error": "no recording"]
        }

        if (!params.file) {
            return ["error": "please provide a file"]
        }

        if (params.type != "wave-right" && params.type != "wave-left") {
            return ["error": "type not supportet"]
        }



        println recording

        if (!recording.renderedWaveForm) {
            recording.renderedWaveForm = new RenderedWaveForm(
                recording: recording
            ).save()
        }


        println recording.renderedWaveForm


        // store to s3 if it is a new file
        def env = Environment.current.name.replace(" ", "-")
        def prefix = "${env}/recording/${recording.id}/waveform"
        def fileName = "${params.type}-${recording.renderedWaveForm.id}-${params.from_sample}-${params.to_sample}.png"

        def path = prefix + "/" + fileName

        println storageBackendService.BUCKET_NAME
        println path

        def bucket = "open-music-annotations-storage-backend"


        String s3FileUrl = storageBackendService.storeMultipartFile(
            bucket,
            path,
            params.file,
            CannedAccessControlList.Private
        )

        println "S3: " + s3FileUrl

        if (!s3FileUrl) {
            println "S3 save error: Recording"
            return [error: "S3 save error: ImageSample"]
        }


        RenderedImageSample renderedImageSample = RenderedImageSample.findOrSaveWhere(
            renderedWaveForm: recording.renderedWaveForm,
            fromSample: Integer.parseInt(params.from_sample),
            toSample: Integer.parseInt(params.to_sample),
            sampleRate: Integer.parseInt(params.sample_rate),
            location: s3FileUrl,
            type: params.type
        )


        renderedImageSample.location = s3FileUrl

        if (!renderedImageSample.save()) {
            println renderedImageSample.errors
            return [error: renderedImageSample.errors]
        }




        if (!recording.save(flush: true)) {
            println recording.errors
            return [error: recording.errors]
        }



        return recording
        /*

        if (exists) return exists

        if (!params.file) {
            return ["error": "please provide a file"]
        }
        MultipartFile f = params.file
        println f.originalFilename

        def r = new Recording(
            title: params.title,
            interpretation: i,
            abstractMusicPart: a
        ).save(flush: true)

        RecordingFileCommand cmd = new RecordingFileCommand(
            version: 1,
            recordingId: r.id,
            recordingFile: f
        )

        r = recordingService.uploadFile(r, cmd)

        return r

         */
    }
}
