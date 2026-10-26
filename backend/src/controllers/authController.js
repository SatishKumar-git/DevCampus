const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password) {
            return res.status(400).json({ error: 'Email aur password zaroori hain' });
        }

        const result = await pool.query(
            'SELECT id, name, email, role, password_hash FROM users WHERE email = $1',
            [email]
        );
        const user = result.rows[0];

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ error: 'Email ya password galat hai' });
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error('Login Error: JWT_SECRET is not configured');
            return res.status(500).json({ error: 'Authentication server configure nahi hai' });
        }

        const token = jwt.sign(
            { sub: String(user.id), role: user.role },
            jwtSecret,
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login Error:', error.message);
        return res.status(500).json({ error: 'Server mein kuch gadbad hai' });
    }
};

const registerUser = async (req, res) => {
    try {
        const { name, email, enrollment_number, password, role, course } = req.body;

        // NAYI LINE: Agar student nahi hai toh inko null kar do
        const finalCourse = role === 'STUDENT' ? course : null;
        const finalEnrollment = role === 'STUDENT' ? enrollment_number : null;

        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'User is email se pehle hi register hai!' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const insertQuery = `
            INSERT INTO users (name, email, enrollment_number, password_hash, role, course)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, name, email, role, course;
        `;
        
        // VALUES array mein finalEnrollment aur finalCourse pass karo
        const values = [name, email, finalEnrollment, hashedPassword, role, finalCourse];
        
        const newUser = await pool.query(insertQuery, values);

        const token = jwt.sign(
            { sub: String(newUser.rows[0].id), role: newUser.rows[0].role },
            process.env.JWT_SECRET || 'secretkey',
            { expiresIn: '1h' }
        );

        res.status(201).json({
            message: 'User successfully register ho gaya!',
            token: token,
            user: newUser.rows[0]
        });

    } catch (error) {
        console.error('Registration Error:', error.message);
        res.status(500).json({ error: 'Server mein kuch gadbad hai' });
    }
};
module.exports = { registerUser, loginUser };