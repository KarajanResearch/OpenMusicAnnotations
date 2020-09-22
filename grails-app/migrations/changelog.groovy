databaseChangeLog = {

    changeSet(author: "martin (generated)", id: "1600760470672-1") {
        addColumn(tableName: "recording") {
            column(name: "is_shared", type: "boolean")
        }
    }


}
