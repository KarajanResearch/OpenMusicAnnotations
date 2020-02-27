databaseChangeLog = {



    changeSet(author: "martin (generated)", id: "1582806369966-2") {
        addColumn(tableName: "recording") {
            column(name: "tempo_id", type: "int8")
        }
    }

    changeSet(author: "martin (generated)", id: "1582806369966-3") {
        addForeignKeyConstraint(baseColumnNames: "tempo_id", baseTableName: "recording", constraintName: "FKakg9bj8fgfb894wmg7q7ing7y", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "session")
    }


}
