const pool = require('../config/db');

exports.getDashboard = async (req, res) => {
    try {
        const [stats] = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE role='student') as studentCount,
        (SELECT COUNT(*) FROM departments) as deptCount,
        (SELECT COUNT(*) FROM hostels) as hostelCount
    `);

        const [recentLogs] = await pool.query('SELECT * FROM activity_history ORDER BY timestamp DESC LIMIT 5');

        res.json({ stats: stats[0], recentLogs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addAllowedStudent = async (req, res) => {
    const { email, register_number } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO allowed_students (email, register_number) VALUES (?, ?)',
            [email, register_number]
        );
        res.status(201).json({ message: 'Student added to allow list', id: result.insertId });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Student already in allow list' });
        }
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
