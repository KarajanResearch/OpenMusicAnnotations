package org.karajanresearch.oma.music

import grails.validation.Validateable
import org.springframework.web.multipart.MultipartFile

class DigitalAudioCommand implements Validateable {


    MultipartFile file
    /**
     * the id of the recording
     */
    Long id

    static constraints = {
        id nullable: true
        file  validator: { val, obj ->
            if ( val == null ) {
                return false
            }
            if ( val.empty ) {
                return false
            }

            ['wav', "mp3"].any { extension ->
                val.originalFilename?.toLowerCase()?.endsWith(extension)
            }
        }
    }


}
