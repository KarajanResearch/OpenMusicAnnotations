databaseChangeLog = {

    changeSet(author: "martin (generated)", id: "1568791820830-1") {
        dropUniqueConstraint(constraintName: "UK_SB8BBOUER5WAK8VYIIY4PF2BX", tableName: "USER")
    }

    changeSet(author: "martin (generated)", id: "1568791820830-2") {
        dropTable(tableName: "USER")
    }
}
