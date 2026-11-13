const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser } = require('../controllers/userController');
const { getLogs } = require('../controllers/logController');
const { protect } = require('../middleware/authMiddleware');
const { verifyAdmin } = require('../middleware/adminMiddleware'); // <-- Import kiya

// Ab in sabhi routes par pehle token check hoga (protect), phir admin check hoga (verifyAdmin)
router.get('/users', protect, verifyAdmin, getAllUsers);
router.delete('/users/:id', protect, verifyAdmin, deleteUser);
router.get('/logs', protect, verifyAdmin, getLogs);

protected = router;
module.exports = router;