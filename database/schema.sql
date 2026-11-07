CREATE DATABASE IF NOT EXISTS iglesia_sanmateo
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE iglesia_sanmateo;

CREATE TABLE IF NOT EXISTS admin_users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  email VARCHAR(190) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin') NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_admin_users_email (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS blog_posts (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(180) NOT NULL,
  excerpt VARCHAR(300) NOT NULL DEFAULT '',
  content MEDIUMTEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  image_url VARCHAR(2048) NULL,
  published_at DATETIME NULL,
  is_published TINYINT(1) NOT NULL DEFAULT 0,
  created_by BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_blog_posts_published (is_published, published_at),
  CONSTRAINT fk_blog_posts_admin FOREIGN KEY (created_by) REFERENCES admin_users (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS library_entries (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(180) NOT NULL,
  summary VARCHAR(500) NOT NULL DEFAULT '',
  content MEDIUMTEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  image_url VARCHAR(2048) NULL,
  source_url VARCHAR(2048) NULL,
  published_at DATETIME NULL,
  is_published TINYINT(1) NOT NULL DEFAULT 0,
  created_by BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_library_entries_published (is_published, published_at),
  KEY idx_library_entries_category (category),
  CONSTRAINT fk_library_entries_admin FOREIGN KEY (created_by) REFERENCES admin_users (id)
) ENGINE=InnoDB;
