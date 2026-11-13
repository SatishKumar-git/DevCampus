const pool = require('../config/db');

// Saare logs fetch karne ke liye
const getLogs = async (req, res) => {
    try {
        const query = `SELECT * FROM logs ORDER BY created_at DESC LIMIT 50;`;
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Fetch Logs Error:', error.message);
        res.status(500).json({ error: 'Logs load karne mein server error aayi hai' });
    }
};

// Naya log insert karne ke liye helper function
const createLog = async (action, performedBy, details) => {
    try {
        const query = `INSERT INTO logs (action, performed_by, details) VALUES ($1, $2, $3);`;
        await pool.query(query, [action, performedBy, details]);
    } catch (error) {
        console.error('Create Log Error:', error.message);
    }
};

module.exports = { getLogs, createLog };