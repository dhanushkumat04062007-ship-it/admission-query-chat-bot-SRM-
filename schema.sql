DROP DATABASE IF EXISTS university_admission_db;
CREATE DATABASE university_admission_db;
USE university_admission_db;

-- 2. Create Tablesadmissions
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    register_number VARCHAR(20),
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT,
    google_id VARCHAR(255) UNIQUE,
    role ENUM('student', 'admin', 'general') DEFAULT 'general',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Allowed Students Table
CREATE TABLE allowed_students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    register_number VARCHAR(20) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Departments Table
CREATE TABLE departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) UNIQUE,
    hod_name VARCHAR(100),
    contact_email VARCHAR(100)
);

-- Courses Table
CREATE TABLE courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    department_id INT,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE,
    duration_years INT,
    fees_per_year DECIMAL(10, 2),
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);

-- Admissions Table
CREATE TABLE admissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    program_name VARCHAR(100) NOT NULL,
    eligibility TEXT,
    start_date DATE,
    end_date DATE,
    fee_structure TEXT,
    intake_limit INT
);

-- Hostels Table
CREATE TABLE hostels (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    type ENUM('Boys', 'Girls') NOT NULL,
    capacity INT NOT NULL,
    current_occupancy INT DEFAULT 0,
    fees_per_year DECIMAL(10, 2)
);

-- Hostel Allocations Table
CREATE TABLE hostel_allocations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    hostel_id INT,
    room_number VARCHAR(20),
    allocated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (hostel_id) REFERENCES hostels(id) ON DELETE CASCADE
);

-- Login Logs
CREATE TABLE login_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    login_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    logout_time DATETIME,
    ip_address VARCHAR(50),
    device TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Activity History
CREATE TABLE activity_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action_type VARCHAR(100),
    description TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Seed Data

-- Departments
INSERT INTO departments (name, code, hod_name, contact_email) VALUES
('Computer Science and Engineering', 'CSE', 'Dr. Anbarasi', 'hod.cse@srmist.edu.in'),
('Electronics and Communication Engineering', 'ECE', 'Dr. Shanthi', 'hod.ece@srmist.edu.in'),
('Mechanical Engineering', 'MECH', 'Dr. Leenus', 'hod.mech@srmist.edu.in'),
('Biotechnology', 'BIO', 'Dr. Waheeta', 'hod.bio@srmist.edu.in'),
('Civil Engineering', 'CIVIL', 'Dr. Pulliyer', 'hod.civil@srmist.edu.in'),
('Information Technology', 'IT', 'Dr. Vadivu', 'hod.it@srmist.edu.in'),
('Electrical and Electronics Engineering', 'EEE', 'Dr. Vijayakumar', 'hod.eee@srmist.edu.in'),
('Architecture', 'ARCH', 'Dr. CT. Lakshmanan', 'hod.arch@srmist.edu.in'),
('Business Administration', 'MBA', 'Dr. V.M. Ponniah', 'dean.mgmt@srmist.edu.in'),
('Law', 'LAW', 'Dr. Sandeep Kulshrestha', 'dean.law@srmist.edu.in');

-- Seed Allowed Students
INSERT INTO allowed_students (email, register_number) VALUES 
('na9755@srmist.edu.in', 'RA2411026011008'),
('ab1234@srmist.edu.in', 'RA2411001010001'),
('cd5678@srmist.edu.in', 'RA2411001010002'),
('ef9012@srmist.edu.in', 'RA2411001010003'),
('gh3456@srmist.edu.in', 'RA2411001010004'),
('ij7890@srmist.edu.in', 'RA2411001010005'),
('kl1234@srmist.edu.in', 'RA2411001010006'),
('mn5678@srmist.edu.in', 'RA2411001010007'),
('op9012@srmist.edu.in', 'RA2411001010008'),
('qr3456@srmist.edu.in', 'RA2411001010009'),
('st7890@srmist.edu.in', 'RA2411001010010'),
('uv1234@srmist.edu.in', 'RA2411001010011'),
('wx5678@srmist.edu.in', 'RA2411001010012'),
('yz9012@srmist.edu.in', 'RA2411001010013');

-- Courses
INSERT INTO courses (department_id, name, code, duration_years, fees_per_year) VALUES
(1, 'B.Tech Computer Science', 'CSE101', 4, 450000.00),
(1, 'B.Tech CSE with AI/ML', 'CSE102', 4, 475000.00),
(1, 'M.Tech Data Science', 'CSE201', 2, 200000.00),
(2, 'B.Tech Electronics & Comm', 'ECE101', 4, 375000.00),
(2, 'M.Tech VLSI Design', 'ECE201', 2, 200000.00),
(3, 'B.Tech Mechanical Engg', 'MECH101', 4, 350000.00),
(3, 'B.Tech Mechatronics', 'MECH102', 4, 350000.00),
(4, 'B.Tech Biotechnology', 'BIO101', 4, 375000.00),
(4, 'M.Tech Genetic Engg', 'BIO201', 2, 200000.00),
(5, 'B.Tech Civil Engineering', 'CIV101', 4, 300000.00),
(6, 'B.Tech IT', 'IT101', 4, 450000.00),
(6, 'B.Tech IT (Cloud Computing)', 'IT102', 4, 450000.00),
(7, 'B.Tech EEE', 'EEE101', 4, 300000.00),
(8, 'B.Arch', 'ARCH101', 5, 400000.00),
(9, 'MBA General', 'MBA101', 2, 400000.00),
(9, 'MBA Finance', 'MBA102', 2, 400000.00),
(9, 'BBA', 'BBA101', 3, 150000.00),
(10, 'LLB', 'LAW101', 3, 200000.00),
(10, 'BA LLB (Hons)', 'LAW102', 5, 250000.00),
(1, 'B.Tech CSE (Cyber Security)', 'CSE103', 4, 475000.00);

-- Hostels
INSERT INTO hostels (name, type, capacity, current_occupancy, fees_per_year) VALUES
('Adhiyaman (Boys)', 'Boys', 500, 320, 110000.00),
('Kaari (Boys)', 'Boys', 400, 380, 115000.00),
('Oori (Boys)', 'Boys', 600, 150, 105000.00),
('Kalpana Chawla (Girls)', 'Girls', 400, 350, 120000.00),
('Meenakshi (Girls)', 'Girls', 300, 290, 115000.00);

-- Admissions
INSERT INTO admissions (program_name, eligibility, start_date, end_date, fee_structure, intake_limit) VALUES
('B.Tech Regular', '10+2 with 60% in PCM', '2024-04-01', '2024-06-30', 'Starts at 3.5L/year', 2000),
('M.Tech', 'B.E/B.Tech with 60%', '2024-05-01', '2024-07-15', '2L/year', 500),
('MBA', 'Any Degree with 60%', '2024-03-01', '2024-05-30', '4L/year', 300),
('Medicine (MBBS)', 'NEET Qualified', '2024-06-01', '2024-08-30', '25L/year', 150),
('Science & Humanities', '10+2 with 50%', '2024-05-15', '2024-07-30', '80k/year', 1000);

INSERT INTO users (name, register_number, email, role)
VALUES
('Naveen Ajay', 'RA2411026011008', 'na9755@srmist.edu.in', 'student'),
('Arun Kumar', 'RA2411001010001', 'arun@srmist.edu.in', 'student'),
('Priya Sharma', 'RA2411001010002', 'priya@srmist.edu.in', 'student'),
('Rahul Verma', 'RA2411001010003', 'rahul@srmist.edu.in', 'student'),
('Sneha Iyer', 'RA2411001010004', 'sneha@srmist.edu.in', 'student'),

('Admin Main', NULL, 'admin@srmist.edu.in', 'admin'),
('Admission Officer', NULL, 'admission@srmist.edu.in', 'admin'),

('Guest User 1', NULL, 'guest1@gmail.com', 'general'),
('Guest User 2', NULL, 'guest2@gmail.com', 'general');

SELECT role, COUNT(*) 
FROM users
GROUP BY role;

CREATE VIEW user_roles_view AS
SELECT name, email, role
FROM users;
SELECT c.name AS course, d.name AS department
FROM courses c
JOIN departments d ON c.department_id = d.id;
SELECT name
FROM courses
WHERE fees_per_year > (
    SELECT AVG(fees_per_year) FROM courses
);
CREATE VIEW course_details_view AS
SELECT c.name AS course, d.name AS department, c.fees_per_year
FROM courses c
JOIN departments d ON c.department_id = d.id;

DELIMITER $$

CREATE TRIGGER before_user_insert
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
    SET NEW.name = UPPER(NEW.name);
END$$

DELIMITER ;
CREATE FUNCTION total_users()
RETURNS INT
DETERMINISTIC
RETURN (SELECT COUNT(*) FROM users);