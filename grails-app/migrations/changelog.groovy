databaseChangeLog = {

    changeSet(author: "martin (generated)", id: "1579090907250-1") {
        addColumn(tableName: "annotation") {
            column(name: "int_value", type: "int4")
        }
    }
}
