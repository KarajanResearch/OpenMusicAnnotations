databaseChangeLog = {

    changeSet(author: "martin (generated)", id: "1581934067227-1") {
        dropForeignKeyConstraint(baseTableName: "rendered_wave_form_rendered_image_sample", constraintName: "fk2vo6r1cd7s9woph4g0v0r5lgi")
    }

    changeSet(author: "martin (generated)", id: "1581934067227-2") {
        dropForeignKeyConstraint(baseTableName: "rendered_wave_form_rendered_image_sample", constraintName: "fk569fd129e8adgjnpmcctbhe4b")
    }

    changeSet(author: "martin (generated)", id: "1581934067227-3") {
        dropForeignKeyConstraint(baseTableName: "rendered_wave_form", constraintName: "fkgo47lvbdlwi6ej6vyu38q23ol")
    }

    changeSet(author: "martin (generated)", id: "1581934067227-4") {
        dropTable(tableName: "rendered_wave_form_rendered_image_sample")
    }

    changeSet(author: "martin (generated)", id: "1581934067227-5") {
        dropTable(tableName: "spectrogram")
    }

    changeSet(author: "martin (generated)", id: "1581934067227-6") {
        dropTable(tableName: "spectrum_sample_window")
    }

    changeSet(author: "martin (generated)", id: "1581934067227-7") {
        dropColumn(columnName: "digital_audio_id", tableName: "rendered_wave_form")
    }

    changeSet(author: "martin (generated)", id: "1581934067227-8") {
        dropColumn(columnName: "sample_offset", tableName: "rendered_image_sample")
    }


}
