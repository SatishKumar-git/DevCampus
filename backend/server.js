require('dotenv').config();
console.log("Mera DB URL yeh hai:", process.env.DATABASE_URL); // <-- Yahan add kiya

// Database connection initialize karna
require('./src/config/db');

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
// Routes ko import karna
const authRoutes = require('./src/routes/authRoutes');

// Auth endpoints: http://localhost:5000/api/auth/register aur /api/auth/login
app.use('/api/auth', authRoutes);
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/projects', require('./src/routes/projectRoutes'));

app.get('/', (req, res) => {
    res.json({ message: 'DevCampus API is running! 🚀' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});