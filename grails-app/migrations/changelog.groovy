databaseChangeLog = {

    changeSet(author: "martin (generated)", id: "1589872333646-1") {
        createTable(tableName: "approle") {
            column(autoIncrement: "true", name: "id", type: "BIGINT") {
                constraints(primaryKey: "true", primaryKeyName: "approlePK")
            }

            column(name: "version", type: "BIGINT") {
                constraints(nullable: "false")
            }

            column(name: "authority", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }
        }
    }



    changeSet(author: "martin (generated)", id: "1589872333646-3") {
        addUniqueConstraint(columnNames: "authority", constraintName: "UC_APPROLEAUTHORITY_COL", tableName: "approle")
    }

    changeSet(author: "martin (generated)", id: "1589872333646-4") {
        addForeignKeyConstraint(baseColumnNames: "role_id", baseTableName: "user_role", constraintName: "FKcqtnbb3pbtyo3t83y2dwebs4f", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "approle")
    }



    changeSet(author: "martin (generated)", id: "1589872333646-6") {
        addForeignKeyConstraint(baseColumnNames: "role_id", baseTableName: "role_group_role", constraintName: "FKnqu5b3f7dsssqifyky103kss4", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "approle")
    }

    changeSet(author: "martin (generated)", id: "1589872333646-7") {
        dropForeignKeyConstraint(baseTableName: "user_role", constraintName: "fka68196081fvovjhkek5m97n3y")
    }

    changeSet(author: "martin (generated)", id: "1589872333646-8") {
        dropForeignKeyConstraint(baseTableName: "role_group_role", constraintName: "fkbo8cffthrm8wxgtnhg0i8dcxw")
    }

    changeSet(author: "martin (generated)", id: "1589872333646-9") {
        dropUniqueConstraint(constraintName: "uk_irsamgnera6angm0prq1kemt2", tableName: "role")
    }

    changeSet(author: "martin (generated)", id: "1589872333646-10") {
        dropTable(tableName: "role")
    }


}
