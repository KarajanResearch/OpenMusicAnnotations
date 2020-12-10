databaseChangeLog = {

    changeSet(author: "martin (generated)", id: "1607586796612-1") {
        createTable(tableName: "annotation_type") {
            column(autoIncrement: "true", name: "id", type: "BIGINT") {
                constraints(primaryKey: "true", primaryKeyName: "annotation_typePK")
            }

            column(name: "version", type: "BIGINT") {
                constraints(nullable: "false")
            }

            column(name: "name", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "martin (generated)", id: "1607586796612-2") {
        addColumn(tableName: "annotation") {
            column(name: "annotation_type_id", type: "int8")
        }
    }

    changeSet(author: "martin (generated)", id: "1607586796612-3") {
        addForeignKeyConstraint(baseColumnNames: "annotation_type_id", baseTableName: "annotation", constraintName: "FKduyq4qp0u4yp1adkgj96nnsll", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "annotation_type")
    }



    changeSet(author: "martin (generated)", id: "1607586796612-14") {
        addNotNullConstraint(columnDataType: "bigint", columnName: "tenant_id", tableName: "annotation")
    }
}
