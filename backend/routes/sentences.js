// SENTENCE BUILDING & CAPITALIZATION ROUTES
// Handles sentence construction, word order, capitalization rules, and grammar activities
// Designed for Kindergarten through 5th grade

const express = require('express'); // Express framework
const router = express.Router(); // Create a router object for sentence-related routes
const sentenceController = require('../controllers/sentenceController'); // Import sentence controller functions

// SENTENCE ACTIVITY ROUTES

// GET /api/sentences/activities - Get sentence activities by grade
// Query parameters: ?grade=kindergarten (or 1st, 2nd, 3rd, 4th, 5th)
// Returns available sentence activities for the specified grade level
router.get('/activities', sentenceController.getSentenceActivities);

// WORD ORDER ACTIVITIES

// POST /api/sentences/word-order - Check word order activity
// Students arrange scrambled words to form correct sentences
// Body: { activityId, userSentence: ['The', 'cat', 'is', 'sleeping'], userId }
router.post('/word-order', sentenceController.checkWordOrder);

// FILL-IN-THE-BLANK ACTIVITIES

// POST /api/sentences/fill-blank - Check fill-in-the-blank activity
// Students choose the correct word to complete sentences
// Body: { activityId, selectedWord, userId }
router.post('/fill-blank', sentenceController.checkFillBlank);

// CAPITALIZATION ACTIVITIES

// POST /api/sentences/capitalization - Check capitalization activity
// Students identify and fix capitalization errors
// Body: { activityId, userSentence, userId }
router.post('/capitalization', sentenceController.checkCapitalization);

// GET /api/sentences/capitalization/rules - Get capitalization rules by grade
// Query parameters: ?grade=kindergarten
// Returns capitalization rules and examples for the specified grade
router.get('/capitalization/rules', sentenceController.getCapitalizationRules);

// CHALLENGE ROUTES

// GET /api/sentences/challenge - Get random sentence challenge
// Query parameters: ?grade=kindergarten
// Generates random sentence-based challenges for students
router.get('/challenge', sentenceController.getRandomSentenceChallenge);

// EXPORT THE ROUTER
// Makes these routes available to the main server
module.exports = router; 