package org.karajanresearch.oma

import grails.converters.JSON
import grails.plugin.springsecurity.annotation.Secured
import org.karajanresearch.oma.annotation.Annotation
import org.karajanresearch.oma.annotation.AnnotationService
import org.karajanresearch.oma.annotation.Session
import org.karajanresearch.oma.music.AbstractMusic
import org.karajanresearch.oma.music.AbstractMusicPart
import org.karajanresearch.oma.music.Composer
import org.karajanresearch.oma.music.Recording
import org.karajanresearch.oma.music.RecordingService
import com.xlson.groovycsv.CsvParser


@Secured("permitAll")
class DataController {



    def getWorks() {
        println params

        def namedParams = [
            composerId: Long.parseLong(params.composerId)
        ]

        def result = AbstractMusic.executeQuery("""
            
            select
                abstractMusic.id,
                abstractMusic.title,
                abstractMusic.subTitle
            
            from AbstractMusic abstractMusic
            join abstractMusic.composer as composer
            where
                composer.id = :composerId
                and abstractMusic.isAuthored = true
                
                
            order by abstractMusic.title

        """, namedParams).collect {
            return [
                id: it[0],
                title: it[1],
                subTitle: it[2]
            ]
        }

        render result as JSON
    }

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

        println "query start: " + new Date()

        def result = Recording.executeQuery("""
            select
                recording.id,
                composer.name,
                composer.id,
                abstractMusic.title,
                abstractMusic.subTitle,
                abstractMusicPart.title,
                count(recording.id),
                interpretation.title,
                abstractMusic.id,
                max(session.id),
                interpretation.conductor,
                interpretation.orchestra,
                interpretation.year
            from Recording recording
            join recording.interpretation interpretation
            join interpretation.abstractMusicParts abstractMusicPart
            join abstractMusicPart.abstractMusic abstractMusic
            join abstractMusic.composer composer
            join recording.annotationSessions session
            
            where recording.isAuthored = true
            
            group by recording.id, composer.name,
                composer.id,
                abstractMusic.title,
                abstractMusic.subTitle,
                abstractMusicPart.title,
                interpretation.title,
                abstractMusic.id,
                interpretation.conductor,
                interpretation.orchestra,
                interpretation.year
                
            order by composer.name, abstractMusic.title, abstractMusic.subTitle, abstractMusicPart.title, interpretation.title
        """
        ).collect {

            return [
                recordingId: it[0],
                composerName: it[1],
                composerId: it[2],
                workTitle: it[3],
                workSubTitle: it[4],
                partTitle: it[5],
                numRecordings: it[6],
                interpretationTitle: it[7],
                workId: it[8],
                sessionId: it[9],
                conductor: it[10],
                orchestra: it[11],
                year: it[12]
            ]
        }

        println "query finished: " + new Date()


        render result as JSON
    }


    def getAnnotations() {
        println params

        def namedParams = [
            sessionId: Long.parseLong(params.sessionId)
        ]

        def result = Session.executeQuery("""
            
            select 
                session.id,
                annotation.id,
                annotation.momentOfPerception,
                annotation.barNumber,
                annotation.beatNumber,
                session.title
            
            from Session session
                join session.annotations as annotation
                join annotation.annotationType as annotationType
            
            where
                session.id = :sessionId
                and annotationType.name like 'Tap'
                
            order by
                annotation.momentOfPerception
            
        """, namedParams).collect{
            return [
                sessionId: it[0],
                annotationId: it[1],
                momentOfPerception: it[2],
                barNumber: it[3],
                beatNumber: it[4],
                bpm: 0.0,
                title: it[5]
            ]
        }


        render result as JSON
    }


    def index() {
        render(view: "ui")
    }

    @Secured("ROLE_ADMIN")
    def session() {
        render(view: "session")
    }


    @Secured("ROLE_ADMIN")
    def getSomething() {
        render params as JSON
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
                it.title = csvLine["korrigierte section"] != "[leer]" ? csvLine["korrigierte section"] : null
                it.isAuthored = true
            }
            recording.isAuthored = true

            recording.interpretation.conductor = csvLine["Conductor"]
            recording.interpretation.orchestra = csvLine["Orchestra"]
            recording.interpretation.year = csvLine["Year"] ? Integer.parseInt(csvLine["Year"]): null


            if (!recording.save(flush: true)) {
                println recording.errors
            } else {
                println recording.interpretation.abstractMusicParts
            }

        }

        render result as JSON
    }


    @Deprecated
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

    def downloadCsv() {
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
    @Secured("ROLE_ADMIN")
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


    @Secured("ROLE_ADMIN")
    def fixWorks() {

        def uniqueWorks = []

        AbstractMusic.list().each { abstractMusic ->

            def work = [
                composerId: abstractMusic.composer.id,
                workTitle: abstractMusic.title
            ]

            if (!uniqueWorks.contains(work)) {
                uniqueWorks.add(work)
            }
        }

        uniqueWorks.each { uniqueWork ->

            def works = AbstractMusic.findAllByComposerAndTitle(
                Composer.get(uniqueWork.composerId), uniqueWork.workTitle
            )


            def first = works.pop()

            println first.id
            println works

            works.each { AbstractMusic obsoleteWork ->

                AbstractMusicPart.findAllByAbstractMusic(obsoleteWork).each {
                    it.abstractMusic = first

                    if (!it.save(flush: true)) {
                        println it.errors
                    } else {
                        println it
                    }

                }

                if (!obsoleteWork.delete(flush: true)) {
                    println obsoleteWork.errors
                }

            }



        }



        render uniqueWorks as JSON
    }




    def downloadBasket() {
        println params
        // recording ids
        def ids = params.id.tokenize(",")

        List<Long> recordingIds = ids.each {
            return Long.parseLong(it)
        }

        def recordings = Recording.findAllByIdInList(recordingIds)

        def file = recordingService.bundleDownload(recordings)
        def outputFileName = "KarajanResearchDataSet.zip"

        response.setContentType("application/zip")
        response.setHeader("Content-Length", file.size().toString())
        response.setHeader("Content-Disposition", "Attachment;Filename=\"${outputFileName}\"")


        def outputStream = response.getOutputStream()
        outputStream << file.newInputStream()
        outputStream.flush()
        outputStream.close()

    }


}
