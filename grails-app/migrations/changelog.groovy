databaseChangeLog = {

    changeSet(author: "martin (generated)", id: "1585562734741-1") {
        addColumn(tableName: "annotation") {
            column(name: "string_value", type: "varchar(255)")
        }
    }


}
