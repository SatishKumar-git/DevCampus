const express = require('express');
const router = express.Router();

// Yahan updateProject aur deleteProject add kiye
const { addProject, getAllProjects, getMyProjects, updateProject, deleteProject } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addProject);
router.get('/', protect, getAllProjects);
router.get('/my-projects', protect, getMyProjects);

// Naye Edit aur Delete routes (/:id url mein project ki ID ke liye hai)
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);

module.exports = router;