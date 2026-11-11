const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { name, email, password, role, register_number } = req.body;

    try {
        // 1. Basic Validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        // 2. Role-specific validation
        if (role === 'student') {
            if (!email.endsWith('@srmist.edu.in')) {
                return res.status(400).json({ message: 'Student email must end with @srmist.edu.in' });
            }

            // Check Allow List
            const [allowed] = await pool.query('SELECT * FROM allowed_students WHERE email = ?', [email]);
            if (allowed.length === 0) {
                return res.status(403).json({ message: 'Email not in allowed students list. Contact Admin.' });
            }
        }

        // 3. Check if user already exists
        const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 4. Hash Password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // 5. Insert User
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password_hash, role, register_number) VALUES (?, ?, ?, ?, ?)',
            [name, email, passwordHash, role || 'general', register_number || null]
        );

        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Check User
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = users[0];

        // 2. Verify Password (if local auth)
        if (!user.password_hash) {
            return res.status(400).json({ message: 'Please use Google Login for this account' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // 3. Generate JWT
        const token = jwt.sign(
            { id: user.id, role: user.role, name: user.name },
            process.env.JWT_SECRET || 'your_jwt_secret_key',
            { expiresIn: '24h' }
        );

        // 4. Log Login
        await pool.query(
            'INSERT INTO login_logs (user_id, ip_address, device) VALUES (?, ?, ?)',
            [user.id, req.ip || null, req.headers['user-agent'] || 'Unknown Device']
        );

        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

exports.adminLogin = async (req, res) => {
    const { username, key } = req.body;

    try {
        // Admin credentials come from the environment (see .env.example).
        // If they are not set, admin login is disabled.
        const adminUsername = process.env.ADMIN_USERNAME;
        const adminKey = process.env.ADMIN_KEY;
        if (adminUsername && adminKey && username === adminUsername && key === adminKey) {

            // Check if admin user exists in DB, if not create/fetch a placeholder admin user
            // For simplicity in this specific request, we will treating this as a system bypass
            // But we need a valid user ID for the token to work with foreign keys (logs)

            // Let's see if a user with role 'admin' exists, if not create one
            let [admins] = await pool.query("SELECT * FROM users WHERE role = 'admin' LIMIT 1");
            let adminUser;

            if (admins.length === 0) {
                // Create the system admin if not exists
                const [result] = await pool.query(
                    "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
                    ['System Admin', 'admin@srmist.edu.in', 'SYSTEM_KEY_ACCESS', 'admin']
                );
                adminUser = { id: result.insertId, name: 'System Admin', email: 'admin@srmist.edu.in', role: 'admin' };
            } else {
                adminUser = admins[0];
            }

            const token = jwt.sign(
                { id: adminUser.id, role: 'admin', name: adminUser.name },
                process.env.JWT_SECRET || 'your_jwt_secret_key',
                { expiresIn: '12h' }
            );

            // Log Admin Login
            await pool.query(
                'INSERT INTO login_logs (user_id, ip_address, device) VALUES (?, ?, ?)',
                [adminUser.id, req.ip || null, 'Admin Console Access']
            );

            return res.json({ token, user: { id: adminUser.id, name: adminUser.name, role: 'admin' } });
        } else {
            return res.status(401).json({ message: 'Invalid Admin Credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during admin login: ' + error.message });
    }
};

exports.googleLogin = async (req, res) => {
    const { email, name, googleId } = req.body; // In real app, verify ID token

    try {
        let [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        let user = users[0];

        if (!user) {
            // Create new General User
            const [result] = await pool.query(
                'INSERT INTO users (name, email, google_id, role) VALUES (?, ?, ?, ?)',
                [name || 'Google User', email, googleId, 'general']
            );
            user = { id: result.insertId, name: name || 'Google User', email, role: 'general' };
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, name: user.name },
            process.env.JWT_SECRET || 'your_jwt_secret_key',
            { expiresIn: '24h' }
        );

        // Log
        await pool.query(
            'INSERT INTO login_logs (user_id, ip_address, device) VALUES (?, ?, ?)',
            [user.id, req.ip || null, req.headers['user-agent'] || 'Unknown Device']
        );

        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

// --- NEW SIMPLIFIED ACCESS FLOW ---

exports.studentAccess = async (req, res) => {
    const { email, register_number } = req.body;

    if (!email || !register_number) {
        return res.status(400).json({ message: 'Email and Register Number are required.' });
    }

    try {
        const [users] = await pool.query('SELECT * FROM users WHERE email = ? AND register_number = ? AND role = "student"', [email, register_number]);
        let user = users[0];

        if (!user) {
            return res.status(403).json({ message: 'No student found with this Email and Register Number combination.' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, name: user.name },
            process.env.JWT_SECRET || 'your_jwt_secret_key',
            { expiresIn: '24h' }
        );

        await pool.query(
            'INSERT INTO login_logs (user_id, ip_address, device) VALUES (?, ?, ?)',
            [user.id, req.ip || null, 'Student Portal Access']
        );

        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

exports.generalAccess = async (req, res) => {
    const name = "General Applicant";
    const email = `guest_${Date.now()}@temp.srmquery.ai`;
    
    try {
        // Create an ephemeral user for the session
        const [result] = await pool.query(
            'INSERT INTO users (name, email, role) VALUES (?, ?, ?)',
            [name, email, 'general']
        );
        const user = { id: result.insertId, name, email, role: 'general' };

        const token = jwt.sign(
            { id: user.id, role: user.role, name: user.name },
            process.env.JWT_SECRET || 'your_jwt_secret_key',
            { expiresIn: '24h' }
        );

        await pool.query(
            'INSERT INTO login_logs (user_id, ip_address, device) VALUES (?, ?, ?)',
            [user.id, req.ip || null, 'General Portal Access']
        );

        res.json({ token, user });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error generating general access: ' + error.message });
    }
};
