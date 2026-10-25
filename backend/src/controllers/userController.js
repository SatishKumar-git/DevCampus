const pool = require('../config/db');

const getAllUsers = async (req, res) => {
    try {
        // Sirf kaam ki details nikalenge, password hash nahi
        const result = await pool.query('SELECT id, name, email, course, role FROM users');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ error: 'Data laane mein dikkat hui' });
    }
};

module.exports = { getAllUsers };