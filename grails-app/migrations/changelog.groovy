databaseChangeLog = {

    changeSet(author: "martin (generated)", id: "1677754603809-1") {
        addColumn(tableName: "interpretation") {
            column(name: "conductor", type: "varchar(255)")
        }
    }

    changeSet(author: "martin (generated)", id: "1677754603809-2") {
        addColumn(tableName: "interpretation") {
            column(name: "orchestra", type: "varchar(255)")
        }
    }

    changeSet(author: "martin (generated)", id: "1677754603809-3") {
        addColumn(tableName: "interpretation") {
            column(name: "year", type: "int4")
        }
    }


}
