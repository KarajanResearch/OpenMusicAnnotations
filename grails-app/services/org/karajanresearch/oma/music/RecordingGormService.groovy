package org.karajanresearch.oma.music

import grails.gorm.transactions.Transactional
import org.karajanresearch.oma.music.DigitalAudio
import org.karajanresearch.oma.music.Recording

@Transactional
class RecordingGormService {

    Recording updateRecordingFile(Long recordingId, Integer version, String recordingFileUrl, String contentType) {

        Recording recording =  Recording.get(recordingId)
        if (!recording) {
            return null
        }

        recording.version = version

        def digitalAudio = new DigitalAudio(recording: recording)


        digitalAudio.location = recordingFileUrl
        digitalAudio.contentType = contentType

        recording.addToDigitalAudio(digitalAudio)

        //statement.statementDocumentUrl = statementDocumentUrl
        //statement.statementDocumentContentType = contentType
        if (!recording.save(flush: true)) {
            println recording.errors
            return null
        }

        return recording
    }
}
