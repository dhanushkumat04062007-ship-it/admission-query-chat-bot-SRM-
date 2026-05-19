const pool = require('../config/db');

exports.getPublicInfo = async (req, res) => {
    try {
        const [admissions] = await pool.query('SELECT * FROM admissions');
        const [departments] = await pool.query('SELECT * FROM departments');

        res.json({ admissions, departments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
