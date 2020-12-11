package org.karajanresearch.oma.music


import grails.gorm.transactions.Transactional
import grails.util.Environment
import org.karajanresearch.oma.StorageBackendService
import org.karajanresearch.oma.annotation.Annotation
import org.karajanresearch.oma.annotation.AnnotationType
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

        Session session = Session.findOrSaveWhere(recording: recording, title: fileName)

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
        // println line

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
        // println parts

        def numberOfColumns = parts.size()

        if (numberOfColumns == 3) {
            // timestamp \t tempo \t beat.bar
            def timestamp = Double.parseDouble(parts[0])
            def tempo = Double.parseDouble(parts[1])
            def abstractMusicPosition = parts[2]

            try {

                Long bar = 1
                Long beat = 1
                Long subdivision = 1
                if (abstractMusicPosition.contains(".")) {
                    def beatbar = abstractMusicPosition.tokenize(".")  // the comma is no comma
                    bar = Long.parseLong(beatbar[0])
                    if (beatbar.size() > 1) {
                        beat = Long.parseLong(beatbar[1])
                    }
                    if (beatbar.size() > 2) {
                        subdivision = Long.parseLong(beatbar[2])
                    }
                } else {
                    bar = Long.parseLong(abstractMusicPosition)
                }


                def a = new Annotation(
                    momentOfPerception: timestamp,
                    annotationType: AnnotationType.findOrSaveWhere(name: "Tap"),
                    barNumber: bar,
                    beatNumber: beat,
                    subdivision: subdivision
                )
                // println a
                return a

            } catch (Exception ex) {
                println ex.message
                println line
                //fallback to a text annotation
                def a = new Annotation(
                    momentOfPerception: timestamp,
                    annotationType: AnnotationType.findOrSaveWhere(name: "Text"),
                    stringValue: "FixMe: " + abstractMusicPosition
                )
                // println a
                return a
            }


        }

        if (numberOfColumns == 2) {
            // no tempo
            def timestamp = Double.parseDouble(parts[0])
            def abstractMusicPosition = parts[1]

            try {
                Long bar = 1
                Long beat = 1
                Long subdivision = 1
                if (abstractMusicPosition.contains(".")) {
                    def beatbar = abstractMusicPosition.tokenize(".")  // the comma is no comma
                    bar = Long.parseLong(beatbar[0])
                    if (beatbar.size() > 1) {
                        beat = Long.parseLong(beatbar[1])
                    }
                    if (beatbar.size() > 2) {
                        subdivision = Long.parseLong(beatbar[2])
                    }
                } else {
                    bar = Long.parseLong(abstractMusicPosition)
                }

                def a = new Annotation(
                    momentOfPerception: timestamp,
                    annotationType: AnnotationType.findOrSaveWhere(name: "Tap"),
                    barNumber: bar,
                    beatNumber: beat,
                    subdivision: subdivision
                )
                // println a
                return a
            } catch (Exception ex) {
                println ex.message

                //fallback to a text annotation
                def a = new Annotation(
                    momentOfPerception: timestamp,
                    annotationType: AnnotationType.findOrSaveWhere(name: "Text"),
                    stringValue: "FixMe: " + abstractMusicPosition
                )
                // println a
                return a


            }


        }

       return null
    }
}
