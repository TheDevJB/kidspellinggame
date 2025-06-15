const express = require('express');
const router = express.Router();
const spellingController = require('../controllers/spellingController');

// Word families routes
router.get('/families', spellingController.getWordFamilies);
router.get('/families/:id', spellingController.getWordFamily);
router.get('/families/:familyId/random-word', spellingController.getRandomWordFromFamily);
router.get('/families/:familyId/sentences', spellingController.getReviewSentences);
router.post('/families/:familyId/complete', spellingController.markFamilyCompleted);

// Words routes
router.get('/words', spellingController.getSpellingWords);
router.get('/word', spellingController.getRandomWord);
router.post('/add', spellingController.addWord);

// Spelling check and progress
router.post('/check', spellingController.checkSpelling);
router.get('/progress/:userId', spellingController.getUserProgress);

module.exports = router;
