databaseChangeLog = {

    changeSet(author: "martin (generated)", id: "1578913456000-1") {
        createSequence(sequenceName: "hibernate_sequence")
    }

    changeSet(author: "martin (generated)", id: "1578913456000-2") {
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

    changeSet(author: "martin (generated)", id: "1578913456000-3") {
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

    changeSet(author: "martin (generated)", id: "1578913456000-4") {
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

    changeSet(author: "martin (generated)", id: "1578913456000-5") {
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

    changeSet(author: "martin (generated)", id: "1578913456000-6") {
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

    changeSet(author: "martin (generated)", id: "1578913456000-7") {
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

            column(name: "location", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "recording_id", type: "BIGINT")

            column(name: "content_type", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "martin (generated)", id: "1578913456000-8") {
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

    changeSet(author: "martin (generated)", id: "1578913456000-9") {
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

    changeSet(author: "martin (generated)", id: "1578913456000-10") {
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

    changeSet(author: "martin (generated)", id: "1578913456000-11") {
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

    changeSet(author: "martin (generated)", id: "1578913456000-12") {
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

    changeSet(author: "martin (generated)", id: "1578913456000-13") {
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

    changeSet(author: "martin (generated)", id: "1578913456000-14") {
        createTable(tableName: "role_group_role") {
            column(name: "role_group_id", type: "BIGINT") {
                constraints(nullable: "false")
            }

            column(name: "role_id", type: "BIGINT") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "martin (generated)", id: "1578913456000-15") {
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

    changeSet(author: "martin (generated)", id: "1578913456000-16") {
        createTable(tableName: "user_role") {
            column(name: "appuser_id", type: "BIGINT") {
                constraints(nullable: "false")
            }

            column(name: "role_id", type: "BIGINT") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "martin (generated)", id: "1578913456000-17") {
        createTable(tableName: "user_role_group") {
            column(name: "role_group_id", type: "BIGINT") {
                constraints(nullable: "false")
            }

            column(name: "appuser_id", type: "BIGINT") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "martin (generated)", id: "1578913456000-18") {
        addPrimaryKey(columnNames: "series", constraintName: "persistent_loginPK", tableName: "persistent_login")
    }

    changeSet(author: "martin (generated)", id: "1578913456000-19") {
        addPrimaryKey(columnNames: "role_group_id, role_id", constraintName: "role_group_rolePK", tableName: "role_group_role")
    }

    changeSet(author: "martin (generated)", id: "1578913456000-20") {
        addPrimaryKey(columnNames: "appuser_id, role_id", constraintName: "user_rolePK", tableName: "user_role")
    }

    changeSet(author: "martin (generated)", id: "1578913456000-21") {
        addPrimaryKey(columnNames: "role_group_id, appuser_id", constraintName: "user_role_groupPK", tableName: "user_role_group")
    }

    changeSet(author: "martin (generated)", id: "1578913456000-22") {
        addUniqueConstraint(columnNames: "username", constraintName: "UC_APPUSERUSERNAME_COL", tableName: "appuser")
    }

    changeSet(author: "martin (generated)", id: "1578913456000-23") {
        addUniqueConstraint(columnNames: "authority", constraintName: "UC_ROLEAUTHORITY_COL", tableName: "role")
    }

    changeSet(author: "martin (generated)", id: "1578913456000-24") {
        addUniqueConstraint(columnNames: "name", constraintName: "UC_ROLE_GROUPNAME_COL", tableName: "role_group")
    }

    changeSet(author: "martin (generated)", id: "1578913456000-25") {
        addForeignKeyConstraint(baseColumnNames: "abstract_music_part_id", baseTableName: "recording", constraintName: "FK26hp77eti87cuc3mj7sviucn8", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "abstract_music_part")
    }

    changeSet(author: "martin (generated)", id: "1578913456000-26") {
        addForeignKeyConstraint(baseColumnNames: "interpretation_id", baseTableName: "abstract_music_part", constraintName: "FK35no130952xl55qbk4t57utmd", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "interpretation")
    }

    changeSet(author: "martin (generated)", id: "1578913456000-27") {
        addForeignKeyConstraint(baseColumnNames: "role_group_id", baseTableName: "user_role_group", constraintName: "FK4u9p3asv1hflckgxegcafajkm", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "role_group")
    }

    changeSet(author: "martin (generated)", id: "1578913456000-28") {
        addForeignKeyConstraint(baseColumnNames: "role_id", baseTableName: "user_role", constraintName: "FKa68196081fvovjhkek5m97n3y", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "role")
    }

    changeSet(author: "martin (generated)", id: "1578913456000-29") {
        addForeignKeyConstraint(baseColumnNames: "role_id", baseTableName: "role_group_role", constraintName: "FKbo8cffthrm8wxgtnhg0i8dcxw", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "role")
    }

    changeSet(author: "martin (generated)", id: "1578913456000-30") {
        addForeignKeyConstraint(baseColumnNames: "recording_id", baseTableName: "session", constraintName: "FKdg853vu8yepmy8rst7uhgof1h", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "recording")
    }

    changeSet(author: "martin (generated)", id: "1578913456000-31") {
        addForeignKeyConstraint(baseColumnNames: "abstract_music_id", baseTableName: "abstract_music_part", constraintName: "FKg6lipe0kbldci5n5bhnhhevr3", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "abstract_music")
    }

    changeSet(author: "martin (generated)", id: "1578913456000-32") {
        addForeignKeyConstraint(baseColumnNames: "appuser_id", baseTableName: "user_role_group", constraintName: "FKgtm16llqi0fjptw8ymh6xx13n", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "appuser")
    }

    changeSet(author: "martin (generated)", id: "1578913456000-33") {
        addForeignKeyConstraint(baseColumnNames: "interpretation_id", baseTableName: "recording", constraintName: "FKhtq7f8p7tipfh7t836hpgy832", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "interpretation")
    }

    changeSet(author: "martin (generated)", id: "1578913456000-34") {
        addForeignKeyConstraint(baseColumnNames: "appuser_id", baseTableName: "user_role", constraintName: "FKjcwpr8jssxdsejf37sd0lfqv6", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "appuser")
    }

    changeSet(author: "martin (generated)", id: "1578913456000-35") {
        addForeignKeyConstraint(baseColumnNames: "role_group_id", baseTableName: "role_group_role", constraintName: "FKlu0ge9c3rhabcfu59589trt1m", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "role_group")
    }

    changeSet(author: "martin (generated)", id: "1578913456000-36") {
        addForeignKeyConstraint(baseColumnNames: "recording_id", baseTableName: "digital_audio", constraintName: "FKpih09f27oimbmnha424kdd8s1", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "recording")
    }

    changeSet(author: "martin (generated)", id: "1578913456000-37") {
        addForeignKeyConstraint(baseColumnNames: "composer_id", baseTableName: "abstract_music", constraintName: "FKq3exa5r305r6uwh1hffe3rkqd", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "composer")
    }

    changeSet(author: "martin (generated)", id: "1578913456000-38") {
        addForeignKeyConstraint(baseColumnNames: "session_id", baseTableName: "annotation", constraintName: "FKr6bno0i9m47r97brpt5jjho56", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "session")
    }
}
