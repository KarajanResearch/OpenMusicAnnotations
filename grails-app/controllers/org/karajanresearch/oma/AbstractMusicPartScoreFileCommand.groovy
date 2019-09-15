package org.karajanresearch.oma

import grails.validation.Validateable
import org.springframework.web.multipart.MultipartFile

class AbstractMusicPartScoreFileCommand implements Validateable {

    MultipartFile scoreFile
    Long abstractMusicPartId
    Integer version


    static constraints = {
        abstractMusicPartId nullable: false
        version nullable: false
        scoreFile  validator: { val, obj ->
            if ( val == null ) {
                return false
            }
            if ( val.empty ) {
                return false
            }

            ['pdf', "pdf"].any { extension ->
                val.originalFilename?.toLowerCase()?.endsWith(extension)
            }
        }
    }
}
