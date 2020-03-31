databaseChangeLog = {





    changeSet(author: "martin (generated)", id: "1585654718248-3") {
        dropForeignKeyConstraint(baseTableName: "recording", constraintName: "fkkt8wgp8itvbui9be8csh1278t")
    }

    changeSet(author: "martin (generated)", id: "1585654718248-4") {
        dropColumn(columnName: "rendered_wave_form_id", tableName: "recording")
    }


}
