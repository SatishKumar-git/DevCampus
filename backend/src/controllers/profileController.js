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
        const userId = req.user.sub; // Token se aayi ID
        
        // req.body mein year aur semester add kar diye
        const { name, course, year, semester, bio, skills, github_link, linkedin_link, portfolio_link } = req.body;

        // COALESCE ensure karta hai ki field khali na ho jaye agar frontend se null aaye
        const updateQuery = `
            UPDATE users
            SET name = COALESCE($1, name),
                course = COALESCE($2, course),
                year = COALESCE($3, year),
                semester = COALESCE($4, semester),
                bio = COALESCE($5, bio),
                skills = COALESCE($6, skills),
                github_link = COALESCE($7, github_link),
                linkedin_link = COALESCE($8, linkedin_link),
                portfolio_link = COALESCE($9, portfolio_link)
            WHERE id = $10
            RETURNING *;
        `;

        const values = [name, course, year, semester, bio, skills, github_link, linkedin_link, portfolio_link, userId];
        const result = await pool.query(updateQuery, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User nahi mila' });
        }

        // Security ke liye password remove kar dete hain frontend par bhejne se pehle
        const updatedUser = result.rows[0];
        delete updatedUser.password_hash;

        res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Profile Update Error:', error.message);
        res.status(500).json({ error: 'Profile update karne mein server error' });
    }
};

module.exports = { getProfile, updateProfile };