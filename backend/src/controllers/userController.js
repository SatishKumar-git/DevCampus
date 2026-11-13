const pool = require('../config/db');
const { createLog } = require('./logController'); // <-- Import kiya

const getAllUsers = async (req, res) => {
    try {
        // Yahan 'ADMIN' ki jagah apni wali email daal do jo tum login ke liye use karte ho
        const query = `SELECT id, name, email, course, year, semester, created_at FROM users WHERE email != 'satishyadav@gmail.com';`;
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Fetch Users Error:', error.message);
        res.status(500).json({ error: 'Users fetch karne mein server error' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Pehle user ka naam nikal lete hain taaki log mein dikhe
        const userCheck = await pool.query(`SELECT name, email FROM users WHERE id = $1;`, [id]);
        if (userCheck.rows.length === 0) {
            return res.status(404).json({ error: 'User nahi mila' });
        }
        const deletedUserName = userCheck.rows[0].name;

        // User delete karo
        const deleteQuery = `DELETE FROM users WHERE id = $1 RETURNING *;`;
        await pool.query(deleteQuery, [id]);

        // Yahan system log mein entry dal di
        await createLog('DELETE_USER', req.user ? req.user.email : 'Admin', `Deleted user: ${deletedUserName}`);

        res.status(200).json({ message: 'User successfully delete ho gaya! 🗑️' });
    } catch (error) {
        console.error('Delete User Error:', error.message);
        res.status(500).json({ error: 'User delete karne mein server error' });
    }
};

module.exports = { getAllUsers, deleteUser };