package oma

class Recording {

    String title

    static constraints = {
        title nullable: true
    }

    String toString() {
        if (!title) {
            return "Recording of "
        } else {
            return title
        }
    }
}
