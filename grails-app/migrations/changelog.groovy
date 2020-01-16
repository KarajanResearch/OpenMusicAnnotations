databaseChangeLog = {

    changeSet(author: "martin (generated)", id: "1579172819104-1") {
        addNotNullConstraint(columnDataType: "bigint", columnName: "recording_id", tableName: "session")
    }
}
