databaseChangeLog = {

    changeSet(author: "martin (generated)", id: "1583142926176-1") {
        createTable(tableName: "authentication_token") {
            column(autoIncrement: "true", name: "id", type: "BIGINT") {
                constraints(primaryKey: "true", primaryKeyName: "authentication_tokenPK")
            }

            column(name: "token_value", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "username", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }
        }
    }





}
