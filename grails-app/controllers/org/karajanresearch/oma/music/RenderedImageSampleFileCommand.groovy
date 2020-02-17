package org.karajanresearch.oma.music

import grails.validation.Validateable
import org.springframework.web.multipart.MultipartFile

class RenderedImageSampleFileCommand implements Validateable {

    MultipartFile file
    Long renderedImageSampleId
    Integer version


    static constraints = {
        renderedImageSampleId nullable: false
        version nullable: false
        file  validator: { val, obj ->
            if ( val == null ) {
                return false
            }
            if ( val.empty ) {
                return false
            }

            ['png', "jpg"].any { extension ->
                val.originalFilename?.toLowerCase()?.endsWith(extension)
            }
        }
    }
}
