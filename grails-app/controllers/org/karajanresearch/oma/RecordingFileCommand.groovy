package org.karajanresearch.oma

import grails.validation.Validateable
import org.springframework.web.multipart.MultipartFile

class RecordingFileCommand implements Validateable {

    MultipartFile recordingFile
    Long recordingId
    Integer version


    static constraints = {
        recordingId nullable: false
        version nullable: false
        recordingFile  validator: { val, obj ->
            if ( val == null ) {
                return false
            }
            if ( val.empty ) {
                return false
            }

            ['wav', 'flac', 'mp3'].any { extension ->
                val.originalFilename?.toLowerCase()?.endsWith(extension)
            }
        }
    }
}
