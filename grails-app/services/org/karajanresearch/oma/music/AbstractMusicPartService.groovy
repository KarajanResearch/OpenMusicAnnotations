package org.karajanresearch.oma.music

import com.amazonaws.services.s3.model.CannedAccessControlList
import grails.gorm.transactions.Transactional
import grails.util.Environment
import org.karajanresearch.oma.StorageBackendService
import org.karajanresearch.oma.music.AbstractMusicPart
import org.karajanresearch.oma.music.AbstractMusicPartScoreFileCommand


//@Service(AbstractMusicPart)
@Transactional
class AbstractMusicPartService {

    /*

    AbstractMusicPart get(Serializable id)

    List<AbstractMusicPart> list(Map args)

    Long count()

    void delete(Serializable id)

    AbstractMusicPart save(AbstractMusicPart abstractMusicPart)
    */

    StorageBackendService storageBackendService

/*
    File getScoreFile(AbstractMusicPart abstractMusicPart) {


        println "getting file from: " + abstractMusicPart.pdfLocation



        return null

    }
*/


    File getScoreFile(AbstractMusicPart abstractMusicPart) {


        if (!abstractMusicPart.pdfLocation) {
            return null
        }

        File file = File.createTempFile("temp",".pdf")

        def keyPath = storageBackendService.getS3Key(abstractMusicPart.pdfLocation)

        def bucket = storageBackendService.getS3Bucket(abstractMusicPart.pdfLocation)

        println keyPath
        println bucket



        def f = storageBackendService.getFile(bucket, keyPath, file.absolutePath)

        println f

        return file


    }

    AbstractMusicPart uploadScoreFile(AbstractMusicPart abstractMusicPart, AbstractMusicPartScoreFileCommand cmd) {

        def env = Environment.current.name.replace(" ", "-")

        def prefix = "${env}/abstractMusicPart/${abstractMusicPart.id}/${new Date().format("yyyy-MM-dd-hh-mm-SS")}"

        def path = "${prefix}_${cmd.scoreFile.originalFilename}"

        println storageBackendService.BUCKET_NAME
        println path

        def bucket = "open-music-annotations-storage-backend"
        String s3FileUrl = storageBackendService.storeMultipartFile(
            bucket,
            path,
            cmd.scoreFile,
            CannedAccessControlList.Private
        )

        println "S3: " + s3FileUrl

        if (!s3FileUrl) return abstractMusicPart

        abstractMusicPart.pdfLocation = s3FileUrl

        if (!abstractMusicPart.save()) {
            println abstractMusicPart.errors

        }

        return abstractMusicPart

    }



}