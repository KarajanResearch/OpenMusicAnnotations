databaseChangeLog = {

    changeSet(author: "martin (generated)", id: "1584959239422-1") {
        dropNotNullConstraint(columnDataType: "bigint", columnName: "abstract_music_part_id", tableName: "recording")
    }


}
