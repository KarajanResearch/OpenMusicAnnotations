databaseChangeLog = {

    changeSet(author: "martin (generated)", id: "1600764996628-1") {
        addColumn(tableName: "session") {
            column(name: "is_shared", type: "boolean")
        }
    }

}
