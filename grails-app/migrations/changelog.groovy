databaseChangeLog = {

    changeSet(author: "martin (generated)", id: "1607588915380-1") {
        addNotNullConstraint(columnDataType: "bigint", columnName: "annotation_type_id", tableName: "annotation")
    }



    changeSet(author: "martin (generated)", id: "1607588915380-12") {
        dropNotNullConstraint(columnDataType: "varchar(255)", columnName: "type", tableName: "annotation")
    }
}
