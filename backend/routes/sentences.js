const express = require('express');
const router = express.Router();
const sentenceController = require('../controllers/sentenceController');

router.get('/activities', sentenceController.getSentenceActivities);

router.post('/word-order', sentenceController.checkWordOrder);

router.post('/fill-blank', sentenceController.checkFillBlank);

router.post('/capitalization', sentenceController.checkCapitalization);

router.get('/capitalization/rules', sentenceController.getCapitalizationRules);

router.get('/challenge', sentenceController.getRandomSentenceChallenge);

module.exports = router; 
