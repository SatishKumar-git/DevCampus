const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { getLogs } = require('../controllers/logController');

router.get('/users', protect, getAllUsers);
router.delete('/users/:id', protect, deleteUser);
router.get('/logs', protect, getLogs);

module.exports = router;