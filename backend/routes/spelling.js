const express = require('express');
const router = express.Router();
const spellingController = require('../controllers/spellingController');

// Word families routes
router.get('/families', spellingController.getWordFamilies);
router.get('/families/:id', spellingController.getWordFamily);

// Words routes
router.get('/words', spellingController.getSpellingWords);
router.get('/word', spellingController.getRandomWord);
router.post('/add', spellingController.addWord);

// Spelling check and progress
router.post('/check', spellingController.checkSpelling);
router.get('/progress/:userId', spellingController.getUserProgress);

module.exports = router;
