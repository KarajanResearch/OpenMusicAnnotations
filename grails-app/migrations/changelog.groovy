databaseChangeLog = {

    changeSet(author: "martin (generated)", id: "1599640027919-1") {
        addColumn(tableName: "interpretation") {
            column(name: "changed_at", type: "timestamp")
        }
    }


}
