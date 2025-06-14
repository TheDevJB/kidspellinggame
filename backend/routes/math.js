const express = require('express');
const router = express.Router();
const mathController = require('../controllers/mathController');
const db = require('../config/data');

router.get('/problems', (req, res) => {
    res.json(db.mathProblems);
});

router.get('/problem', mathController.getRandomProblem);

router.post('/check', mathController.checkAnswer);

router.post('/add', mathController.addProblem);

module.exports = router;
