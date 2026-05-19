const pool = require('../config/db');

exports.getDashboard = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get user logic history
        const [logs] = await pool.query('SELECT * FROM activity_history WHERE user_id = ? ORDER BY timestamp DESC LIMIT 10', [userId]);

        // Get hostel allocation if any
        const [hostel] = await pool.query(`
      SELECT h.name, ha.room_number 
      FROM hostel_allocations ha 
      JOIN hostels h ON ha.hostel_id = h.id 
      WHERE ha.user_id = ?
    `, [userId]);

        res.json({
            activity: logs,
            hostel: hostel[0] || null,
            message: `Welcome back, ${req.user.name}`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
