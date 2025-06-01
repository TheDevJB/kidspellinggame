const express = require('express');
const router = express.Router();
const spellingController = require('../controllers/spellingController');
const db = require('../config/data');

// Get all words (for viewing the database)
router.get('/words', (req, res) => {
    res.json(db.spellingWords);
});

// Get random word
router.get('/word', spellingController.getRandomWord);

// Check spelling
router.post('/check', spellingController.checkSpelling);

// Add new word
router.post('/add', spellingController.addWord);

module.exports = router;
