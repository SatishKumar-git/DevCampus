const pool = require('../config/db');

const verifyAdmin = async (req, res, next) => {
    try {
        // req.user token se aata hai (authMiddleware ke baad)
        const userId = req.user.sub || req.user.id;

        const result = await pool.query('SELECT role FROM users WHERE id = $1', [userId]);

        // Yahan .toLowerCase() add kar diya hai taaki 'ADMIN' aur 'admin' match ho jaye
        if (result.rows.length === 0 || result.rows[0].role.toLowerCase() !== 'admin') {
            return res.status(403).json({ error: 'Access denied! Yeh sirf admin ke liye hai.' });
        }

        next(); // Agar admin hai toh aage jane do
    } catch (error) {
        console.error('Admin Check Error:', error.message);
        res.status(500).json({ error: 'Server error in admin verification' });
    }
};

module.exports = { verifyAdmin };