const express = require('express');
const router = express.Router();

// Controller import
const { getProfile, updateProfile } = require('../controllers/profileController');

// Middleware import (Yahan 'protect' naam use karna hai)
const { protect } = require('../middleware/authMiddleware'); 

// Routes mein ab 'protect' pass karenge
router.get('/', protect, getProfile);
router.put('/', protect, updateProfile);

module.exports = router;