databaseChangeLog = {

    changeSet(author: "martin (generated)", id: "1596098811306-1") {
        dropForeignKeyConstraint(baseTableName: "rendered_image_sample", constraintName: "fkc7wtq07hbg8y4efhifa93f41i")
    }

    changeSet(author: "martin (generated)", id: "1596098811306-2") {
        dropTable(tableName: "rendered_image_sample")
    }

    changeSet(author: "martin (generated)", id: "1596098811306-3") {
        dropTable(tableName: "rendered_wave_form")
    }


}
