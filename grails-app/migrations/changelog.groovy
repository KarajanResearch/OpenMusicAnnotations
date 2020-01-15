databaseChangeLog = {

    changeSet(author: "martin (generated)", id: "1579080923933-1") {
        createSequence(sequenceName: "hibernate_sequence")
    }

    changeSet(author: "martin (generated)", id: "1579080923933-2") {
        createTable(tableName: "abstract_music") {
            column(autoIncrement: "true", name: "id", type: "BIGINT") {
                constraints(primaryKey: "true", primaryKeyName: "abstract_musicPK")
            }

            column(name: "version", type: "BIGINT") {
                constraints(nullable: "false")
            }

            column(name: "tenant_id", type: "BIGINT") {
                constraints(nullable: "false")
            }

            column(name: "title", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "composer_id", type: "BIGINT") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "martin (generated)", id: "1579080923933-3") {
        createTable(tableName: "abstract_music_part") {
            column(autoIncrement: "true", name: "id", type: "BIGINT") {
                constraints(primaryKey: "true", primaryKeyName: "abstract_music_partPK")
            }

            column(name: "version", type: "BIGINT") {
                constraints(nullable: "false")
            }

            column(name: "tenant_id", type: "BIGINT") {
                constraints(nullable: "false")
            }

            column(name: "title", type: "VARCHAR(255)")

            column(name: "abstract_music_id", type: "BIGINT") {
                constraints(nullable: "false")
            }

            column(name: "interpretation_order", type: "BIGINT") {
                constraints(nullable: "false")
            }

            column(name: "bar_number_offset", type: "FLOAT8") {
                constraints(nullable: "false")
            }

            column(name: "pdf_location", type: "VARCHAR(255)")

            column(name: "interpretation_id", type: "BIGINT") {
                constraints(nullable: "false")
            }

            column(name: "number_of_bars", type: "FLOAT8") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "martin (generated)", id: "1579080923933-4") {
        createTable(tableName: "annotation") {
            column(autoIncrement: "true", name: "id", type: "BIGINT") {
                constraints(primaryKey: "true", primaryKeyName: "annotationPK")
            }

            column(name: "version", type: "BIGINT") {
                constraints(nullable: "false")
            }

            column(name: "session_id", type: "BIGINT") {
                constraints(nullable: "false")
            }

            column(name: "type", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "subdivision", type: "BIGINT")

            column(name: "moment_of_perception", type: "FLOAT8") {
                constraints(nullable: "false")
            }

            column(name: "bar_number", type: "BIGINT")

            column(name: "beat_number", type: "BIGINT")
        }
    }

    changeSet(author: "martin (generated)", id: "1579080923933-5") {
        createTable(tableName: "appuser") {
            column(autoIncrement: "true", name: "id", type: "BIGINT") {
                constraints(primaryKey: "true", primaryKeyName: "appuserPK")
            }

            column(name: "version", type: "BIGINT") {
                constraints(nullable: "false")
            }

            column(name: "password_expired", type: "BOOLEAN") {
                constraints(nullable: "false")
            }

            column(name: "username", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "account_locked", type: "BOOLEAN") {
                constraints(nullable: "false")
            }

            column(name: "password", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "account_expired", type: "BOOLEAN") {
                constraints(nullable: "false")
            }

            column(name: "enabled", type: "BOOLEAN") {
                constraints(nullable: "false")
            }

            column(name: "email", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "martin (generated)", id: "1579080923933-6") {
        createTable(tableName: "composer") {
            column(autoIncrement: "true", name: "id", type: "BIGINT") {
                constraints(primaryKey: "true", primaryKeyName: "composerPK")
            }

            column(name: "version", type: "BIGINT") {
                constraints(nullable: "false")
            }

            column(name: "tenant_id", type: "BIGINT") {
                constraints(nullable: "false")
            }

            column(name: "name", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "martin (generated)", id: "1579080923933-7") {
        createTable(tableName: "digital_audio") {
            column(autoIncrement: "true", name: "id", type: "BIGINT") {
                constraints(primaryKey: "true", primaryKeyName: "digital_audioPK")
            }

            column(name: "version", type: "BIGINT") {
                constraints(nullable: "false")
            }

            column(name: "tenant_id", type: "BIGINT") {
                constraints(nullable: "false")
            }

            column(name: "original_file_name", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "location", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "recording_id", type: "BIGINT")

            column(name: "content_type", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "martin (generated)", id: "1579080923933-8") {
        createTable(tableName: "interpretation") {
            column(autoIncrement: "true", name: "id", type: "BIGINT") {
                constraints(primaryKey: "true", primaryKeyName: "interpretationPK")
            }

            column(name: "version", type: "BIGINT") {
                constraints(nullable: "false")
            }

            column(name: "tenant_id", type: "BIGINT") {
                constraints(nullable: "false")
            }

            column(name: "title", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "martin (generated)", id: "1579080923933-9") {
        createTable(tableName: "persistent_login") {
            column(name: "series", type: "VARCHAR(64)") {
                constraints(nullable: "false")
            }

            column(name: "username", type: "VARCHAR(64)") {
                constraints(nullable: "false")
            }

            column(name: "token", type: "VARCHAR(64)") {
                constraints(nullable: "false")
            }

            column(name: "last_used", type: "TIMESTAMP WITHOUT TIME ZONE") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "martin (generated)", id: "1579080923933-10") {
        createTable(tableName: "recording") {
            column(autoIncrement: "true", name: "id", type: "BIGINT") {
                constraints(primaryKey: "true", primaryKeyName: "recordingPK")
            }

            column(name: "version", type: "BIGINT") {
                constraints(nullable: "false")
            }

            column(name: "tenant_id", type: "BIGINT") {
                constraints(nullable: "false")
            }

            column(name: "title", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "abstract_music_part_id", type: "BIGINT") {
                constraints(nullable: "false")
            }

            column(name: "interpretation_id", type: "BIGINT") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "martin (generated)", id: "1579080923933-11") {
        createTable(tableName: "recording_recording_data") {
            column(name: "recording_id", type: "BIGINT") {
                constraints(nullable: "false")
            }

            column(name: "recording_data_object", type: "VARCHAR(255)")

            column(name: "recording_data_idx", type: "VARCHAR(255)")

            column(name: "recording_data_elt", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "martin (generated)", id: "1579080923933-12") {
        createTable(tableName: "role") {
            column(autoIncrement: "true", name: "id", type: "BIGINT") {
                constraints(primaryKey: "true", primaryKeyName: "rolePK")
            }

            column(name: "version", type: "BIGINT") {
                constraints(nullable: "false")
            }

            column(name: "authority", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "martin (generated)", id: "1579080923933-13") {
        createTable(tableName: "role_group") {
            column(autoIncrement: "true", name: "id", type: "BIGINT") {
                constraints(primaryKey: "true", primaryKeyName: "role_groupPK")
            }

            column(name: "version", type: "BIGINT") {
                constraints(nullable: "false")
            }

            column(name: "name", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "martin (generated)", id: "1579080923933-14") {
        createTable(tableName: "role_group_role") {
            column(name: "role_group_id", type: "BIGINT") {
                constraints(nullable: "false")
            }

            column(name: "role_id", type: "BIGINT") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "martin (generated)", id: "1579080923933-15") {
        createTable(tableName: "session") {
            column(autoIncrement: "true", name: "id", type: "BIGINT") {
                constraints(primaryKey: "true", primaryKeyName: "sessionPK")
            }

            column(name: "version", type: "BIGINT") {
                constraints(nullable: "false")
            }

            column(name: "tenant_id", type: "BIGINT") {
                constraints(nullable: "false")
            }

            column(name: "title", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "start_timestamp", type: "TIMESTAMP WITHOUT TIME ZONE")

            column(name: "recording_id", type: "BIGINT") {
                constraints(nullable: "false")
            }

            column(name: "end_timestamp", type: "TIMESTAMP WITHOUT TIME ZONE")
        }
    }

    changeSet(author: "martin (generated)", id: "1579080923933-16") {
        createTable(tableName: "spectrogram") {
            column(autoIncrement: "true", name: "id", type: "BIGINT") {
                constraints(primaryKey: "true", primaryKeyName: "spectrogramPK")
            }

            column(name: "version", type: "BIGINT") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "martin (generated)", id: "1579080923933-17") {
        createTable(tableName: "spectrum_sample") {
            column(autoIncrement: "true", name: "id", type: "BIGINT") {
                constraints(primaryKey: "true", primaryKeyName: "spectrum_samplePK")
            }

            column(name: "version", type: "BIGINT") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "martin (generated)", id: "1579080923933-18") {
        createTable(tableName: "spectrum_sample_window") {
            column(autoIncrement: "true", name: "id", type: "BIGINT") {
                constraints(primaryKey: "true", primaryKeyName: "spectrum_sample_windowPK")
            }

            column(name: "version", type: "BIGINT") {
                constraints(nullable: "false")
            }

            column(name: "sample_rate", type: "FLOAT8") {
                constraints(nullable: "false")
            }

            column(name: "number_of_samples", type: "BIGINT") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "martin (generated)", id: "1579080923933-19") {
        createTable(tableName: "user_role") {
            column(name: "appuser_id", type: "BIGINT") {
                constraints(nullable: "false")
            }

            column(name: "role_id", type: "BIGINT") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "martin (generated)", id: "1579080923933-20") {
        createTable(tableName: "user_role_group") {
            column(name: "role_group_id", type: "BIGINT") {
                constraints(nullable: "false")
            }

            column(name: "appuser_id", type: "BIGINT") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "martin (generated)", id: "1579080923933-21") {
        addPrimaryKey(columnNames: "series", constraintName: "persistent_loginPK", tableName: "persistent_login")
    }

    changeSet(author: "martin (generated)", id: "1579080923933-22") {
        addPrimaryKey(columnNames: "role_group_id, role_id", constraintName: "role_group_rolePK", tableName: "role_group_role")
    }

    changeSet(author: "martin (generated)", id: "1579080923933-23") {
        addPrimaryKey(columnNames: "appuser_id, role_id", constraintName: "user_rolePK", tableName: "user_role")
    }

    changeSet(author: "martin (generated)", id: "1579080923933-24") {
        addPrimaryKey(columnNames: "role_group_id, appuser_id", constraintName: "user_role_groupPK", tableName: "user_role_group")
    }

    changeSet(author: "martin (generated)", id: "1579080923933-25") {
        addUniqueConstraint(columnNames: "username", constraintName: "UC_APPUSERUSERNAME_COL", tableName: "appuser")
    }

    changeSet(author: "martin (generated)", id: "1579080923933-26") {
        addUniqueConstraint(columnNames: "authority", constraintName: "UC_ROLEAUTHORITY_COL", tableName: "role")
    }

    changeSet(author: "martin (generated)", id: "1579080923933-27") {
        addUniqueConstraint(columnNames: "name", constraintName: "UC_ROLE_GROUPNAME_COL", tableName: "role_group")
    }

    changeSet(author: "martin (generated)", id: "1579080923933-28") {
        addForeignKeyConstraint(baseColumnNames: "abstract_music_part_id", baseTableName: "recording", constraintName: "FK26hp77eti87cuc3mj7sviucn8", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "abstract_music_part")
    }

    changeSet(author: "martin (generated)", id: "1579080923933-29") {
        addForeignKeyConstraint(baseColumnNames: "interpretation_id", baseTableName: "abstract_music_part", constraintName: "FK35no130952xl55qbk4t57utmd", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "interpretation")
    }

    changeSet(author: "martin (generated)", id: "1579080923933-30") {
        addForeignKeyConstraint(baseColumnNames: "role_group_id", baseTableName: "user_role_group", constraintName: "FK4u9p3asv1hflckgxegcafajkm", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "role_group")
    }

    changeSet(author: "martin (generated)", id: "1579080923933-31") {
        addForeignKeyConstraint(baseColumnNames: "role_id", baseTableName: "user_role", constraintName: "FKa68196081fvovjhkek5m97n3y", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "role")
    }

    changeSet(author: "martin (generated)", id: "1579080923933-32") {
        addForeignKeyConstraint(baseColumnNames: "role_id", baseTableName: "role_group_role", constraintName: "FKbo8cffthrm8wxgtnhg0i8dcxw", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "role")
    }

    changeSet(author: "martin (generated)", id: "1579080923933-33") {
        addForeignKeyConstraint(baseColumnNames: "recording_id", baseTableName: "session", constraintName: "FKdg853vu8yepmy8rst7uhgof1h", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "recording")
    }

    changeSet(author: "martin (generated)", id: "1579080923933-34") {
        addForeignKeyConstraint(baseColumnNames: "abstract_music_id", baseTableName: "abstract_music_part", constraintName: "FKg6lipe0kbldci5n5bhnhhevr3", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "abstract_music")
    }

    changeSet(author: "martin (generated)", id: "1579080923933-35") {
        addForeignKeyConstraint(baseColumnNames: "appuser_id", baseTableName: "user_role_group", constraintName: "FKgtm16llqi0fjptw8ymh6xx13n", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "appuser")
    }

    changeSet(author: "martin (generated)", id: "1579080923933-36") {
        addForeignKeyConstraint(baseColumnNames: "interpretation_id", baseTableName: "recording", constraintName: "FKhtq7f8p7tipfh7t836hpgy832", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "interpretation")
    }

    changeSet(author: "martin (generated)", id: "1579080923933-37") {
        addForeignKeyConstraint(baseColumnNames: "appuser_id", baseTableName: "user_role", constraintName: "FKjcwpr8jssxdsejf37sd0lfqv6", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "appuser")
    }

    changeSet(author: "martin (generated)", id: "1579080923933-38") {
        addForeignKeyConstraint(baseColumnNames: "role_group_id", baseTableName: "role_group_role", constraintName: "FKlu0ge9c3rhabcfu59589trt1m", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "role_group")
    }

    changeSet(author: "martin (generated)", id: "1579080923933-39") {
        addForeignKeyConstraint(baseColumnNames: "recording_id", baseTableName: "digital_audio", constraintName: "FKpih09f27oimbmnha424kdd8s1", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "recording")
    }

    changeSet(author: "martin (generated)", id: "1579080923933-40") {
        addForeignKeyConstraint(baseColumnNames: "composer_id", baseTableName: "abstract_music", constraintName: "FKq3exa5r305r6uwh1hffe3rkqd", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "composer")
    }

    changeSet(author: "martin (generated)", id: "1579080923933-41") {
        addForeignKeyConstraint(baseColumnNames: "session_id", baseTableName: "annotation", constraintName: "FKr6bno0i9m47r97brpt5jjho56", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "session")
    }
}
