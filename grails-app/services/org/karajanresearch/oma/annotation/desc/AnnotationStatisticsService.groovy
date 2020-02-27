package org.karajanresearch.oma.annotation.desc

import org.karajanresearch.oma.annotation.Annotation
import org.karajanresearch.oma.annotation.Session

class AnnotationStatisticsService {










    /**
     * takes a set of annotation sessions and calculates average and stddev of beats
     * @param sessions
     * @return
     */
    def describeSessions(Set<Session> sessions) {

        // per type, i guess...

        def commonSubdivision


        def floatingBeats = []

        def boundBeats = [:]
        def describedBeats = [:]


        sessions.each { Session session ->
            // checking the counting for this session
            def countUntil = 0

            session.annotations.each { Annotation annotation ->

                switch (annotation.type) {
                    case "Tap":
                        if(annotation.barNumber && annotation.beatNumber) {
                            // check counting. find max beatNumber within a bar
                            if (annotation.beatNumber > countUntil) {
                                countUntil = annotation.beatNumber
                            }
                        }
                        break

                    default:
                        println "describeSessions: not implemented"
                        println session
                        return
                }
            }
            println "we count until " + countUntil + " in this session: " + session
        }


        sessions.each { Session session ->

            session.annotations.each { Annotation annotation ->

                switch (annotation.type) {
                    case "Tap":
                        if(annotation.barNumber && annotation.beatNumber) {

                            // beat bound to logical score
                            if (!boundBeats[annotation.barNumber]) {
                                boundBeats[annotation.barNumber] = [:]
                                describedBeats[annotation.barNumber] = [:]
                            }
                            if (!boundBeats[annotation.barNumber][annotation.beatNumber]) {
                                boundBeats[annotation.barNumber][annotation.beatNumber] = []
                                describedBeats[annotation.barNumber][annotation.beatNumber] = [:]
                            }
                            boundBeats[annotation.barNumber][annotation.beatNumber].add(annotation.momentOfPerception)

                        } else {
                            // just any floating beat
                            floatingBeats.add(annotation)
                        }
                        break

                    default:
                        println "describeSessions: not implemented"
                        println session
                        return
                }
            }
        }

        // align the "1" a.k.a. find the common rhythmical feel. apply half-time and double-time transformations

        // first approach: vote for majority. the largest number of sessions sharing the same way to count determine
        // the way to count for the others.



        // TODO: make floating beats bound to score by alignment based on momentOfPerception




        boundBeats.each { barNum, bar ->
            // println "Bar: " + barNum
            bar.each { beatNum, beat ->
                // println "Beat: " + beatNum
                def sum = 0.0
                def n = 0
                beat.each { sample ->
                    sum += sample
                    n += 1
                }
                def average = sum / n

                def sumOfSquares = 0.0
                n = 0
                beat.each { sample ->
                    sumOfSquares += Math.pow(sample - average, 2)
                    n += 1
                }
                def stddev = 0.0
                if (n > 1) {
                    stddev = Math.sqrt(sumOfSquares / (n-1))
                }

                describedBeats[barNum][beatNum]["avg"] = average
                describedBeats[barNum][beatNum]["std"] = stddev

            }
        }


        return describedBeats
    }



}
