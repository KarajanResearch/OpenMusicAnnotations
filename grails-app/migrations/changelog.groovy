databaseChangeLog = {

    changeSet(author: "martin (generated)", id: "1677079838489-1") {
        dropColumn(columnName: "tenant_id", tableName: "abstract_music")
    }

    changeSet(author: "martin (generated)", id: "1677079838489-2") {
        dropColumn(columnName: "tenant_id", tableName: "abstract_music_part")
    }

    changeSet(author: "martin (generated)", id: "1677079838489-3") {
        dropColumn(columnName: "tenant_id", tableName: "annotation")
    }

    changeSet(author: "martin (generated)", id: "1677079838489-4") {
        dropColumn(columnName: "tenant_id", tableName: "composer")
    }

    changeSet(author: "martin (generated)", id: "1677079838489-5") {
        dropColumn(columnName: "tenant_id", tableName: "digital_audio")
    }

    changeSet(author: "martin (generated)", id: "1677079838489-6") {
        dropColumn(columnName: "tenant_id", tableName: "interpretation")
    }

    changeSet(author: "martin (generated)", id: "1677079838489-7") {
        dropColumn(columnName: "tenant_id", tableName: "recording")
    }

    changeSet(author: "martin (generated)", id: "1677079838489-8") {
        dropColumn(columnName: "tenant_id", tableName: "session")
    }


}
