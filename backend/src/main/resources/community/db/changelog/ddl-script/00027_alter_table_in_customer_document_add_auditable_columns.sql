-- liquibase formatted sql

-- changeset ErandiDeSilva:00025_alter_table_in_customer_document_add_auditable_columns
ALTER TABLE ` in_customer_document `
    ADD COLUMN ` created_by ` varchar (255) DEFAULT NULL,
    ADD COLUMN ` created_date ` datetime(6) DEFAULT NULL,
    ADD COLUMN ` last_modified_by ` varchar (255) DEFAULT NULL,
    ADD COLUMN ` last_modified_date ` datetime(6) DEFAULT NULL;

-- rollback ALTER TABLE `in_customer_document`
-- DROP COLUMN `created_by`,
-- DROP COLUMN `created_date`,
-- DROP COLUMN `last_modified_by`,
-- DROP COLUMN `last_modified_date`;
