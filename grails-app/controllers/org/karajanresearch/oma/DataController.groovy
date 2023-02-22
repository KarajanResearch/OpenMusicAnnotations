package org.karajanresearch.oma

import grails.converters.JSON
import grails.plugin.springsecurity.annotation.Secured
import org.karajanresearch.oma.annotation.Annotation
import org.karajanresearch.oma.annotation.Session
import org.karajanresearch.oma.music.AbstractMusic
import org.karajanresearch.oma.music.Composer
import org.karajanresearch.oma.music.Recording
import org.karajanresearch.oma.music.RecordingService
import com.xlson.groovycsv.CsvParser



@Secured("permitAll")
class DataController {


    def getComposers() {
        println params

        def result = Composer.executeQuery("""
            
            select
                composer.id,
                composer.name
            
            from Composer composer
            where
                composer.isAuthored = true
                
            order by composer.name


        """).collect {
            return [
                id: it[0],
                name: it[1]
            ]
        }

        render result as JSON
    }

    def getRecordings() {
        println params

        def result = Recording.executeQuery("""
            select
                abstractMusicParts.id,
                composer.name,
                composer.id,
                abstractMusic.title,
                abstractMusic.subTitle,
                abstractMusicParts.title,
                count(recording.id)
            from Recording recording
            join recording.interpretation interpretation
            join interpretation.abstractMusicParts abstractMusicParts
            join abstractMusicParts.abstractMusic abstractMusic
            join abstractMusic.composer composer
            
            where recording.isAuthored = true
            
            group by abstractMusicParts.id, composer.name,
                composer.id,
                abstractMusic.title,
                abstractMusic.subTitle,
                abstractMusicParts.title
                
            order by composer.name, abstractMusic.title, abstractMusic.subTitle
        """
        ).collect {



            return [
                abstractMusicPartId: it[0],
                composerName: it[1],
                composerId: it[2],
                workTitle: it[3],
                workSubTitle: it[4],
                partTitle: it[5],
                numRecordings: it[6]

            ]
        }

        render result as JSON
    }



    def index(Integer max) {

        render(view: "index", model:[recordingList: []])
    }

    @Deprecated
    def ajaxIndex() {

        println params

        def result = Recording.executeQuery("""
            select
                recording.id, 
                recording.title, 
                interpretation.title, 
                abstractMusicParts.title,
                composer.name,
                abstractMusic.title
            from Recording recording
            join recording.interpretation interpretation
            join interpretation.abstractMusicParts abstractMusicParts
            join abstractMusicParts.abstractMusic abstractMusic
            join abstractMusic.composer composer
            
        """
        ).collect {

            def compositionTitle = it[5]
            if (it[3]) {
                compositionTitle = compositionTitle + ": " + it[3]
            }

            return [
                id: it[0],
                title: it[1],
                interpretationTitle: it[2],
                abstractMusicTitle: compositionTitle,
                composerName: it[4]
            ]
        }


        render result as JSON


    }


    @Secured("ROLE_ADMIN")
    def toSpreadSheet() {
        def result = Recording.executeQuery("""
            select
                recording.id, 
                recording.title, 
                interpretation.title, 
                abstractMusicParts.title,
                composer.name,
                abstractMusic.title
            from Recording recording
            join recording.interpretation interpretation
            join interpretation.abstractMusicParts abstractMusicParts
            join abstractMusicParts.abstractMusic abstractMusic
            join abstractMusic.composer composer
            
        """
        ).collect {

            def compositionTitle = it[5]
            if (it[3]) {
                compositionTitle = compositionTitle + ": " + it[3]
            }

            return [
                id: it[0],
                composerName: it[4],
                abstractMusicTitle: it[5],
                abstractMusicPartTitle: it[3],
                interpretationTitle: it[2],
                title: it[1]
            ]
        }


        render result as JSON

    }


    @Secured("ROLE_ADMIN")
    def fixDataFromCsv() {

        def path = grailsApplication.config.getProperty("oma.dataDirectory.development")


        path = path + "/csvImports/OMA Datenpflege - Kopie von Korrekturen vor Import.csv"

        println path


        def csvFile = new File(path)
        def csvData = new CsvParser().parse(csvFile.newReader())

        LinkedHashMap<Integer, Object> result = [:]
        while (csvData.hasNext()) {
            def line = csvData.next()

            //result.add(line)
            def convertedLine = [:]
            line.columns.each { k, v ->
                convertedLine[k] = line.values[v]
            }

            //valid data? skipping headers
            try {
                def validWorkId = Integer.parseInt(convertedLine.id)
                //println validWorkId
                result[validWorkId] = convertedLine
            } catch (Exception ex) {
                println ex.message
            }


        }


        result.collect {recordingId, csvLine ->

            Recording recording = Recording.get(recordingId)
            if (!recording) {
                println "error"
            }

            //recording.title = csvLine[""]
            recording.interpretation.abstractMusicParts.each {
                it.abstractMusic.composer.name = csvLine["korrigierter composerName"]
                it.abstractMusic.composer.isAuthored = true
                it.abstractMusic.title = csvLine["korrigierter work"]
                it.abstractMusic.subTitle = csvLine["NEU: work number"]
                it.abstractMusic.isAuthored = true
                it.title = csvLine["korrigierter section"]
                it.isAuthored = true
            }
            recording.isAuthored = true

            if (!recording.save(flush: true)) {
                println recording.errors
            } else {
                println recording.interpretation.abstractMusicParts
            }

        }

        render result as JSON

    }



    def downloadJson() {
        println params
        def ids = params.id.tokenize(",")

        List<Long> recordingIds = ids.each {
            return Long.parseLong(it)
        }


        def result = Recording.findAllByIdInList(recordingIds).collect {
            def compositionTitle = it.interpretation.abstractMusicParts[0].abstractMusic.title
            if (it.interpretation.abstractMusicParts[0].title) {
                compositionTitle = compositionTitle + ": " + it.interpretation.abstractMusicParts[0].title
            }

            return [
                id: it.id,
                abstractMusicTitle: compositionTitle,
                composerName: it.interpretation.abstractMusicParts[0].abstractMusic.composer.name,
                interpretationTitle: it.interpretation.title,
                sessions: it.annotationSessions.collect { Session session ->
                    return [
                        title: session.title,
                        annotations: session.annotations.sort{Annotation a -> a.momentOfPerception }.collect { Annotation annotation ->
                            return [
                                type: annotation.annotationType.name,
                                bar: annotation.barNumber,
                                beat: annotation.beatNumber,
                                momentOfPerception: annotation.momentOfPerception
                            ]
                        }
                    ]
                }
            ]
        }

        render result as JSON
    }

    RecordingService recordingService
    def getPeaksFile(Long id) {

        println "getPeaksFile: " + id

        def recording = recordingService.get(id)
        if (!recording) return notFound()


        def file = recordingService.getPeaksFile(recording)
        if (!file) return notFound()


        response.setContentType("application/json")
        response.setHeader("Content-Disposition", "inline;Filename=\"${recording.id}.peaks.json\"")
        response.setHeader("Content-Length", file.size().toString())


        try {
            def outputStream = response.getOutputStream()
            outputStream << file.newInputStream()
            outputStream.flush()
            outputStream.close()
        } catch (Exception ex) {
            println ex.message
        }


    }




    @Secured("ROLE_ADMIN")
    def fixComposers() {

        def existingNames = []

        Composer.list().each { composer ->
            if (!existingNames.contains(composer.name)) {
                existingNames.add(composer.name)
            }
        }
        existingNames.each {
            def composer = Composer.findByName(it)

            println composer

            def others = Composer.findAllByNameAndIdNotEqual(composer.name, composer.id)

            println others

            if (others.size() > 0) {
                others.each { Composer other ->
                    AbstractMusic.findAllByComposer(other).each {
                        it.composer = composer

                        if (!it.save(flush: true)) {
                            println it.errors
                        } else {
                            println it
                        }
                    }
                    if (!other.delete(flush: true)) {
                        println other.errors
                    }
                }

            }

        }



        render "OK"

    }

}
