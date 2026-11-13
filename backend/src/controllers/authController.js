const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

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
        const { name, email, password, course, enrollment_number, year, semester, role } = req.body;
        
        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Name, email aur password zaroori hain' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // 🔍 Yahan dhyan do: Frontend se 'TEACHER' ya 'STUDENT' aa raha hai
        let userRole = 'STUDENT'; // Default
        if (role) {
            const cleanRole = role.trim().toUpperCase();
            if (cleanRole === 'TEACHER') {
                userRole = 'TEACHER';
            } else if (cleanRole === 'STUDENT') {
                userRole = 'STUDENT';
            }
        }
        
        const query = `
            INSERT INTO users (name, email, password_hash, course, enrollment_number, year, semester, role) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
            RETURNING id, name, email, role;
        `;
        
        const result = await pool.query(query, [
            name, 
            email, 
            hashedPassword, 
            course || null, 
            enrollment_number || null, 
            year || null, 
            semester || null, 
            userRole
        ]);
        
        const jwtSecret = process.env.JWT_SECRET;
        const token = jwt.sign(
            { sub: String(result.rows[0].id), role: result.rows[0].role },
            jwtSecret,
            { expiresIn: '1h' }
        );

        res.status(201).json({ 
            message: 'Registration successful!', 
            token,
            user: result.rows[0] 
        });
    } catch (error) {
        console.error('Register Error:', error.message);
        res.status(500).json({ error: 'Server error during registration' });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email dena zaroori hai' });
        }

        // 1. Check karo ki email database mein hai ya nahi
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length === 0) {
            return res.status(404).json({ error: 'Is email se koi account nahi mila' });
        }

        // 2. Resend API se Email Bhejo
        const { data, error } = await resend.emails.send({
            from: 'DevCampus <onboarding@resend.dev>',
            to: email,
            subject: 'DevCampus - Password Reset Link',
            html: '<p>Apna password reset karne ke liye is link par click karein: <strong><a href="http://localhost:5173/reset-password">Reset Password</a></strong></p>'
        });

        if (error) {
            console.error('Resend Error:', error);
            return res.status(400).json({ error: 'Email bhejne mein problem aayi' });
        }

        console.log("Email successfully bheja gaya:", data);
        return res.status(200).json({ message: 'Password reset link email par bhej diya gaya hai.' });

    } catch (error) {
        console.error('Forgot Password Error:', error.message);
        return res.status(500).json({ error: 'Server mein kuch gadbad hai' });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({ error: 'Email aur naya password dono zaroori hain' });
        }

        // Naye password ko hash (encrypt) karna
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Database mein password update karna
        const updateQuery = 'UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING *';
        const result = await pool.query(updateQuery, [hashedPassword, email]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Is email se koi account nahi mila' });
        }

        return res.status(200).json({ message: 'Password successfully update ho gaya!' });

    } catch (error) {
        console.error('Reset Password Error:', error.message);
        return res.status(500).json({ error: 'Server mein kuch gadbad hai' });
    }
};
module.exports = { registerUser, loginUser, forgotPassword, resetPassword };