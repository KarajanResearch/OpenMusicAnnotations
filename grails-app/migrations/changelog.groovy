databaseChangeLog = {

    changeSet(author: "martin (generated)", id: "1599051110675-1") {
        dropNotNullConstraint(columnDataType: "float8", columnName: "bar_number_offset", tableName: "abstract_music_part")
    }


    changeSet(author: "martin (generated)", id: "1599051110675-12") {
        dropNotNullConstraint(columnDataType: "bigint", columnName: "interpretation_order", tableName: "abstract_music_part")
    }

    changeSet(author: "martin (generated)", id: "1599051110675-13") {
        dropNotNullConstraint(columnDataType: "float8", columnName: "number_of_bars", tableName: "abstract_music_part")
    }
}
