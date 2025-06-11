// ENHANCED SPELLING ROUTES
// Handles spelling activities with grade-level progression, word families, and detailed feedback
// Supports Pre-K through 5th grade with adaptive difficulty

const express = require('express'); // Express framework
const router = express.Router(); // Create a router object - this groups related routes together
const spellingController = require('../controllers/spellingController'); // Import our business logic functions
const db = require('../config/data'); // Import our data/database configuration

// SPELLING WORD ROUTES

// GET /api/spelling/words - Get spelling words with filtering options
// Query parameters: ?grade=pre-k&family=at&difficulty=easy
// This is useful for getting words by specific criteria
router.get('/words', spellingController.getSpellingWords);

// GET /api/spelling/word - Get random word with enhanced options
// Query parameters: ?grade=pre-k&family=at&difficulty=easy&userId=1
// This endpoint returns a single random word for the spelling game
// The actual logic is handled in the controller (separation of concerns)
router.get('/word', spellingController.getRandomWord);

// WORD FAMILY ROUTES

// GET /api/spelling/families - Get word families by grade
// Query parameters: ?grade=pre-k
// Returns available word families for the specified grade level
router.get('/families', spellingController.getWordFamilies);

// SPELLING ACTIVITY ROUTES

// POST /api/spelling/check - Check spelling with enhanced feedback
// This endpoint receives a spelling attempt and provides detailed feedback
// Body: { wordId, attempt, userId, timeSpent }
// POST is used because we're sending data (the spelling attempt) to the server
router.post('/check', spellingController.checkSpelling);

// PROGRESS TRACKING ROUTES

// GET /api/spelling/progress/:userId - Get user's spelling progress
// Returns detailed progress statistics, family progress, and achievements
router.get('/progress/:userId', spellingController.getUserSpellingProgress);

// ADMIN ROUTES

// POST /api/spelling/add - Add new word (enhanced admin function)
// This endpoint allows adding new words to the database
// Body: { word, grade, difficulty, family, hint, sentence, audio }
// POST is used because we're creating/adding new data
router.post('/add', spellingController.addWord);

// LEGACY COMPATIBILITY ROUTE
// GET /api/spelling/words/all - Get all words (for viewing the database)
// This maintains backward compatibility with the original simple route
router.get('/words/all', (req, res) => {
    // req = incoming request data, res = response object to send data back
    res.json({
        message: 'All spelling words retrieved successfully',
        totalWords: db.spellingWords.length,
        words: db.spellingWords
    }); // Send all spelling words as JSON response
});

// EXPORT THE ROUTER
// This makes the router available to other files (like server.js)
// When server.js does app.use('/api/spelling', require('./routes/spelling'))
// it's importing and using this router object
module.exports = router;
