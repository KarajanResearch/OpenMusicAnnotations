databaseChangeLog = {

    changeSet(author: "martin (generated)", id: "1582105578705-1") {
        addColumn(tableName: "rendered_image_sample") {
            column(name: "type", type: "varchar(255)")
        }
    }


}
