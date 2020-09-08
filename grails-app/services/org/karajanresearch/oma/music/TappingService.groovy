package org.karajanresearch.oma.music


import grails.gorm.transactions.Transactional
import grails.util.Environment
import org.karajanresearch.oma.StorageBackendService
import org.karajanresearch.oma.annotation.Annotation
import org.karajanresearch.oma.annotation.Session
import org.karajanresearch.oma.music.Recording
import org.karajanresearch.oma.music.TappingFileCommand


@Transactional
class TappingService {

    StorageBackendService storageBackendService


    def uploadFile(Recording recording, TappingFileCommand cmd) {

        def env = Environment.current.name.replace(" ", "-")
        def prefix = "${env}/recording/${recording.id}/${new Date().format("yyyy-MM-dd-hh-mm-SS")}"

        def fileName = cmd.tappingFile.originalFilename
        //fileName = fileName.replace('[', "_")
        //fileName = fileName.replace("]", "_")
        //fileName = fileName.replace(" ", "_")
        fileName = fileName.replace("\\", "/")
        def fileNameParts = fileName.split("/")
        //println fileNameParts
        fileName = fileNameParts[fileNameParts.size()-1]

        def path = "${prefix}_tapping_${fileName}"

        println path


        // process data. overwrite existing annotations from same-named file

        Session session = Session.findOrSaveWhere(recording: recording, title: "Upload of " + fileName)

        // reset session
        if (session.annotations)
            session.annotations.clear()


        cmd.tappingFile.inputStream.readLines().each { line ->

            def annotation = parseDataLine(line)
            if (annotation) {
                session.addToAnnotations(annotation)
            }

        }

        session.save(flush: true)


        return session

    }


    /**
     * parsing all supported CSV formats from here on
     * @param line
     * @return
     */
    Annotation parseDataLine(String line) {

        // unify delimiters
        println line

        if (line.contains(";")) {
            // german windows style delimiter
            line = line.replace(";", "\t")
            line = line.replace(",", ".")
        } else if (line.contains("\t")) {
            // already a tab delimiter
            // do nothing
        } else {
            // we assume "," delimiter and "." for floating points
            line = line.replace(",", "\t")
            //
        }

        // now tokenize by unified tab delimiter
        def parts = line.tokenize("\t")
        println parts

        def numberOfColumns = parts.size()

        if (numberOfColumns == 3) {
            // timestamp \t tempo \t beat.bar

            def timestamp = Double.parseDouble(parts[0])
            def tempo = Double.parseDouble(parts[1])

            Long bar = 1
            Long beat = 1
            if (parts[2].contains(".")) {
                def beatbar = parts[2].tokenize(".")  // the comma is no comma
                bar = Long.parseLong(beatbar[0])
                beat = Long.parseLong(beatbar[1])
            } else {
                bar = Long.parseLong(parts[2])
            }


            def a = new Annotation(
                momentOfPerception: timestamp,
                type: "Tap",
                barNumber: bar,
                beatNumber: beat
            )
            println a
            return a
        }

       return null
    }
}
