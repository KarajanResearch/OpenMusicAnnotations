databaseChangeLog = {

    changeSet(author: "martin (generated)", id: "1599118115985-1") {
        dropForeignKeyConstraint(baseTableName: "recording", constraintName: "fk26hp77eti87cuc3mj7sviucn8")
    }

    changeSet(author: "martin (generated)", id: "1599118115985-2") {
        dropColumn(columnName: "abstract_music_part_id", tableName: "recording")
    }


}
