const express = require('express');
const router = express.Router();

// 1. Saare functions ek hi baar mein import kar liye
const { 
    addProject, 
    getAllProjects, 
    getMyProjects, 
    updateProject, 
    deleteProject, 
    assignMarks 
} = require('../controllers/projectController');

// 2. Sirf 'protect' middleware import kiya jo route ko secure karega
const { protect } = require('../middleware/authMiddleware');

// Purane Routes
router.post('/', protect, addProject);
router.get('/', protect, getAllProjects);
router.get('/my-projects', protect, getMyProjects);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);

// Naya Marks Assign karne ka route (Yahan bhi 'protect' laga diya)
router.put('/:id/marks', protect, assignMarks);

module.exports = router;