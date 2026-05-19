-- Show Constraints
DESCRIBE users;

-- 1. Aggregate
SELECT role, COUNT(*) 
FROM users
GROUP BY role;

-- 2. HAVING (important)
SELECT role, COUNT(*) AS total
FROM users
GROUP BY role
HAVING COUNT(*) > 1;

-- 3. Join
SELECT c.name AS course, d.name AS department
FROM courses c
JOIN departments d ON c.department_id = d.id;

-- 4. Subquery
SELECT name
FROM courses
WHERE fees_per_year > (
    SELECT AVG(fees_per_year) FROM courses
);

-- 5. View
SELECT * FROM user_roles_view;

-- 6. Second View
SELECT * FROM course_details_view;

-- 7. Trigger Test
INSERT INTO users (name, email, role)
VALUES ('demo user', 'demo5@gmail.com', 'student');

SELECT name FROM users WHERE email = 'demo5@gmail.com';

-- 8. Function
SELECT total_users();