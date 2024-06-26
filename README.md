# OpenMusicAnnotations

## Description

Welcome to the Open Music Annotation Cloud, a database for any type of terms, tags, or attributes that humans associate with audible music. 

The project was started and funded by https://karajan-research.org to collect and share musical data of various research projects.

## Documentation

### What is a Recording

The center of all musical data in the Open Music Annotation Cloud is the recording, i.e., music recorded to a medium (usually WAV files).

In classical music, virtually any piece audible today was composed long before artists interpreted it and have recorded that interpretation to a medium. For example, Beethoven composed his symphonies long before Herbert von Karajan was born. Much later Karajan decides to interpret a Beethoven symphony with his orchestra of choice. Once he was happy with the result Karajan and the orchestra performed the symphony and have a record company create a recording of that concert and sell that recording on mediums such as records, CDs, or Spotify.

On the other hand, music can happen very differently from the classic approach. For example, a group of musicians can book a studio, setup for live recording and create a recording of completely improvised music. The result is also a recording that can be distributed through any music medium but there are no references to any composition.

The minimum recording information in the Open Music Annotation Cloud is a title and a WAV file. Information about the interpretation, the composition, and the composer is optional, but recommended for classical pieces.

### What is an Interpretation

The same classical composition performed by different conductors and different orchestras sound different. For classical music lovers, that differences often make them prefer one conductors interpretation over some other conductors interpretation.

The minimum interpretation information in the Open Music Annotation Cloud is a Composition, e.g. Beethovens 5th Symphony, and an interpretation title, e.g., Karajan conducting the BPO in 1962.

### The Connection between Annotation, Recording, Interpretation and Composition
![High level data model of recordings](https://github.com/KarajanResearch/OpenMusicAnnotations/blob/master/doc/High%20Level%20Data%20Model%20of%20Recordings.png)

### Using Open Music Annotation Cloud

THe Open Music Annotation Cloud is online at https://oma.digital


## Developer Docs
Open Music Annotation Cloud is a Grails application. [Read about the Grails app structure](http://docs.grails.org/latest/guide/introduction.html). Apply [Grails conventions](http://docs.grails.org/latest/guide/gettingStarted.html#conventionOverConfiguration) to navigate the software modules in the grails-app directory.

To add functionality to the Open Music Annotation Cloud, fork the repo and add your code. Feel free to file pull requests if ou think our changes should be part of the official code base.

## License
The Open Music Annotations Cloud is Open Source. Contact us for license details.
