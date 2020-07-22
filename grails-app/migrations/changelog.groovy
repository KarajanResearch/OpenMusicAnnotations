databaseChangeLog = {

    changeSet(author: "martin (generated)", id: "1593601102153-1") {
        addColumn(tableName: "rendered_wave_form") {
            column(name: "recording_id", type: "int8") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "martin (generated)", id: "1593601102153-2") {
        addForeignKeyConstraint(baseColumnNames: "recording_id", baseTableName: "rendered_wave_form", constraintName: "FKjw55rvw48qnwcf1vwu61ja0i6", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "recording")
    }

    changeSet(author: "martin (generated)", id: "1593601102153-3") {
        dropForeignKeyConstraint(baseTableName: "user_role", constraintName: "FKcqtnbb3pbtyo3t83y2dwebs4f")
    }

    changeSet(author: "martin (generated)", id: "1593601102153-4") {
        dropUniqueConstraint(constraintName: "uc_approleauthority_col", tableName: "approle")
    }

    changeSet(author: "martin (generated)", id: "1593601102153-5") {
        dropTable(tableName: "approle")
    }

    changeSet(author: "martin (generated)", id: "1593601102153-6") {
        addDefaultValue(columnDataType: "bigint", columnName: "id", defaultValueComputed: "nextval('abstract_music_id_seq'::regclass)", tableName: "abstract_music")
    }

    changeSet(author: "martin (generated)", id: "1593601102153-7") {
        addDefaultValue(columnDataType: "bigint", columnName: "id", defaultValueComputed: "nextval('abstract_music_part_id_seq'::regclass)", tableName: "abstract_music_part")
    }

    changeSet(author: "martin (generated)", id: "1593601102153-8") {
        addDefaultValue(columnDataType: "bigint", columnName: "id", defaultValueComputed: "nextval('annotation_id_seq'::regclass)", tableName: "annotation")
    }

    changeSet(author: "martin (generated)", id: "1593601102153-9") {
        addDefaultValue(columnDataType: "bigint", columnName: "id", defaultValueComputed: "nextval('appuser_id_seq'::regclass)", tableName: "appuser")
    }

    changeSet(author: "martin (generated)", id: "1593601102153-10") {
        addDefaultValue(columnDataType: "bigint", columnName: "id", defaultValueComputed: "nextval('composer_id_seq'::regclass)", tableName: "composer")
    }

    changeSet(author: "martin (generated)", id: "1593601102153-11") {
        addDefaultValue(columnDataType: "bigint", columnName: "id", defaultValueComputed: "nextval('digital_audio_id_seq'::regclass)", tableName: "digital_audio")
    }

    changeSet(author: "martin (generated)", id: "1593601102153-12") {
        addDefaultValue(columnDataType: "bigint", columnName: "id", defaultValueComputed: "nextval('interpretation_id_seq'::regclass)", tableName: "interpretation")
    }

    changeSet(author: "martin (generated)", id: "1593601102153-13") {
        addDefaultValue(columnDataType: "bigint", columnName: "id", defaultValueComputed: "nextval('recording_id_seq'::regclass)", tableName: "recording")
    }

    changeSet(author: "martin (generated)", id: "1593601102153-14") {
        addDefaultValue(columnDataType: "bigint", columnName: "id", defaultValueComputed: "nextval('rendered_image_sample_id_seq'::regclass)", tableName: "rendered_image_sample")
    }

    changeSet(author: "martin (generated)", id: "1593601102153-15") {
        addDefaultValue(columnDataType: "bigint", columnName: "id", defaultValueComputed: "nextval('rendered_wave_form_id_seq'::regclass)", tableName: "rendered_wave_form")
    }

    changeSet(author: "martin (generated)", id: "1593601102153-16") {
        addDefaultValue(columnDataType: "bigint", columnName: "id", defaultValueComputed: "nextval('role_id_seq'::regclass)", tableName: "role")
    }

    changeSet(author: "martin (generated)", id: "1593601102153-17") {
        addDefaultValue(columnDataType: "bigint", columnName: "id", defaultValueComputed: "nextval('role_group_id_seq'::regclass)", tableName: "role_group")
    }

    changeSet(author: "martin (generated)", id: "1593601102153-18") {
        addDefaultValue(columnDataType: "bigint", columnName: "id", defaultValueComputed: "nextval('session_id_seq'::regclass)", tableName: "session")
    }
}
