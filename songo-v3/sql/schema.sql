-- ============================================================
--  schema.sql — Songo 237 · Version 3 Modernisée
--  Importer dans phpMyAdmin ou via :
--    mysql -u root -p < schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS songo_db
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE songo_db;

CREATE TABLE IF NOT EXISTS parties (
  id           INT          AUTO_INCREMENT PRIMARY KEY,
  code_partie  VARCHAR(8)   NOT NULL UNIQUE,
  etat         MEDIUMTEXT   NOT NULL,
  joueur_nord  VARCHAR(32)  DEFAULT NULL,
  joueur_sud   VARCHAR(32)  DEFAULT NULL,
  created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_code ON parties(code_partie);
