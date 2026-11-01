const pool = require('../config/db'); // Apna DB path match kar lena

// User ki profile fetch karne ke liye
const getProfile = async (req, res) => {
    try {
        const userId = req.user.sub; // Token se ID li
        const query = 'SELECT name, email, course, bio, skills, github_link, linkedin_link, portfolio_link FROM users WHERE id = $1';
        const result = await pool.query(query, [userId]);
        
        if (result.rows.length === 0) return res.status(404).json({ error: "User nahi mila" });
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Profile Fetch Error:', error.message);
        res.status(500).json({ error: "Server error" });
    }
};

// User ki profile update karne ke liye
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.sub;
        const { name, course, bio, skills, github_link, linkedin_link, portfolio_link } = req.body;
        
        const query = `
            UPDATE users 
            SET name = $1, course = $2, bio = $3, skills = $4, github_link = $5, linkedin_link = $6, portfolio_link = $7
            WHERE id = $8 RETURNING name, course, bio, skills, github_link, linkedin_link, portfolio_link;
        `;
        const values = [name, course, bio, skills, github_link, linkedin_link, portfolio_link, userId];
        
        const result = await pool.query(query, values);
        res.status(200).json({ message: "Profile updated successfully", user: result.rows[0] });
    } catch (error) {
        console.error('Profile Update Error:', error.message);
        res.status(500).json({ error: "Profile update mein error aayi" });
    }
};

module.exports = { getProfile, updateProfile };