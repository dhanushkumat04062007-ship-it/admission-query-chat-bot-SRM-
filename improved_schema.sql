-- =========================================================================
-- IMPROVED SCHEMA FOR DBMS PROJECT (NORMALIZATION + ACID + CONCURRENCY)
-- =========================================================================

DROP DATABASE IF EXISTS university_admission_db;
CREATE DATABASE university_admission_db;
USE university_admission_db;

-- 1. USERS TABLE
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    register_number VARCHAR(20) UNIQUE,        -- Guaranteed 1:1 mapping if exists
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT,
    google_id VARCHAR(255) UNIQUE,
    role ENUM('student', 'admin', 'general') DEFAULT 'general',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. ALLOWED STUDENTS (Look-up Table)
CREATE TABLE allowed_students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    register_number VARCHAR(20) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. DEPARTMENTS
CREATE TABLE departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) UNIQUE,
    hod_name VARCHAR(100),
    contact_email VARCHAR(100)
);

-- 4. COURSES (Updated for ACID / Concurrency)
CREATE TABLE courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    department_id INT,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE,
    duration_years INT,
    fees_per_year DECIMAL(10, 2),
    intake_capacity INT NOT NULL,              -- Total limits for this program
    available_seats INT NOT NULL,              -- Target for concurrency locks (FOR UPDATE)
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
    CHECK (available_seats >= 0 AND available_seats <= intake_capacity) -- Domain Integrity
);

-- 5. APPLICATIONS (Replaces original 'admissions' table for 3NF/BCNF)
-- Acts as the relationship entity mapping Student (M) -> Course (N)
CREATE TABLE applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'enrolled') DEFAULT 'pending',
    application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_course (user_id, course_id) -- BCNF: Prevents duplicate applications
);

-- 6. HOSTELS (Updated for ACID)
CREATE TABLE hostels (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    type ENUM('Boys', 'Girls') NOT NULL,
    capacity INT NOT NULL,
    available_seats INT NOT NULL,              -- Acid atomic operation target
    fees_per_year DECIMAL(10, 2),
    CHECK (available_seats >= 0 AND available_seats <= capacity)
);

-- 7. HOSTEL ALLOCATIONS
CREATE TABLE hostel_allocations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    hostel_id INT NOT NULL,
    room_number VARCHAR(20),
    allocated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (hostel_id) REFERENCES hostels(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_hostel (user_id)   -- 1 Student can only have 1 bed
);

-- 8. LOGIN LOGS
CREATE TABLE login_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    login_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    logout_time DATETIME,
    ip_address VARCHAR(50),
    device TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 9. ACTIVITY HISTORY
CREATE TABLE activity_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action_type VARCHAR(100),
    description TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =======================================================
-- Example Triggers (Data Consistency)
-- =======================================================

DELIMITER $$
CREATE TRIGGER before_user_insert
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
    SET NEW.name = UPPER(NEW.name);
END$$
DELIMITER ;
