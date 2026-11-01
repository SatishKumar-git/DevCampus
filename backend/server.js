require('dotenv').config();
const express = require('express');
const cors = require('cors');

// PostgreSQL Database connection ko import karna
const pool = require('./src/config/db');

const app = express();

app.use(cors());
app.use(express.json());

// Routes ko import karna
const authRoutes = require('./src/routes/authRoutes');
const profileRoutes = require('./src/routes/profileRoutes');

// Auth & API endpoints
app.use('/api/auth', authRoutes);
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/profile', profileRoutes);
app.use('/api/projects', require('./src/routes/projectRoutes'));

// ==========================================
// PORTFOLIO API ROUTE (PostgreSQL Version)
// ==========================================
app.get('/api/portfolio/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // 1. User ki profile find karo (raw SQL query)
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User profile not found" });
    }

    const profile = userResult.rows[0];
    delete profile.password; // Frontend par password nahi bhejna hai

    // 2. Us user ke projects find karo ('user_id' column use karke)
    const projectResult = await pool.query('SELECT * FROM projects WHERE user_id = $1', [userId]);
    const projects = projectResult.rows;

    // 3. Dono ko ek sath frontend ko bhej do
    res.json({
      profile: profile,
      projects: projects
    });

  } catch (error) {
    console.error("Portfolio fetch error:", error);
    res.status(500).json({ message: "Server error fetching portfolio data" });
  }
});
// ==========================================

app.get('/', (req, res) => {
    res.json({ message: 'DevCampus API is running! 🚀' });
});

// Server Start Karne Ka Code
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});