databaseChangeLog = {

    changeSet(author: "martin (generated)", id: "1583317130895-1") {
        addColumn(tableName: "authentication_token") {
            column(name: "date_created", type: "timestamp")
        }
    }

    changeSet(author: "martin (generated)", id: "1583317130895-2") {
        dropTable(tableName: "persistent_login")
    }

}
