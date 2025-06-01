const express = require('express');
const router = express.Router();
const mathController = require('../controllers/mathController');
const db = require('../config/data');

// Get all math problems (for viewing the database)
router.get('/problems', (req, res) => {
    res.json(db.mathProblems);
});

// Get random math problem
router.get('/problem', mathController.getRandomProblem);

// Check answer
router.post('/check', mathController.checkAnswer);

// Add new problem
router.post('/add', mathController.addProblem);

module.exports = router;
