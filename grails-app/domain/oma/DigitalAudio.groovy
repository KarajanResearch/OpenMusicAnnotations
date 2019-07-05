package oma

class DigitalAudio {

    /**
     * url, where the oma server can access the digital audio file
     */
    String location


    static constraints = {
        location nullable: false
    }
}
