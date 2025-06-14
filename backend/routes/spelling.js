const express = require('express');
const router = express.Router();
const spellingController = require('../controllers/spellingController');
const db = require('../config/data');

router.get('/words', spellingController.getSpellingWords);

router.get('/word', spellingController.getRandomWord);

router.get('/families', spellingController.getWordFamilies);

router.post('/check', spellingController.checkSpelling);

router.get('/progress/:userId', spellingController.getUserSpellingProgress);

router.post('/add', spellingController.addWord);

router.get('/words/all', (req, res) => {
    res.json({
        message: 'All spelling words retrieved successfully',
        totalWords: db.spellingWords.length,
        words: db.spellingWords
    });
});

module.exports = router;
