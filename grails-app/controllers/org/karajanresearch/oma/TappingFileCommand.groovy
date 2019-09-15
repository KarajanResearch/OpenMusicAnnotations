package org.karajanresearch.oma

import grails.validation.Validateable
import org.springframework.web.multipart.MultipartFile

class TappingFileCommand implements Validateable {

    MultipartFile tappingFile
    Long recordingId
    Integer version


    static constraints = {
        recordingId nullable: false
        version nullable: false
        tappingFile  validator: { val, obj ->
            if ( val == null ) {
                return false
            }
            if ( val.empty ) {
                return false
            }

            ['txt', 'csv', 'tsv'].any { extension ->
                val.originalFilename?.toLowerCase()?.endsWith(extension)
            }
        }
    }
}
