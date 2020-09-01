databaseChangeLog = {

    changeSet(author: "martin (generated)", id: "1598956219850-1") {
        dropNotNullConstraint(columnDataType: "bigint", columnName: "composer_id", tableName: "abstract_music")
    }

    
}
