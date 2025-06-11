// COLOR LEARNING ROUTES
// Handles color identification, color mixing, and interactive color activities
// Designed for Pre-K and Kindergarten students

const express = require('express'); // Express framework
const router = express.Router(); // Create a router object for color-related routes
const colorController = require('../controllers/colorController'); // Import color controller functions

// COLOR LESSON ROUTES

// GET /api/colors/lessons - Get color lessons by grade
// Query parameters: ?grade=pre-k or ?grade=kindergarten
// Returns available color lessons for the specified grade level
router.get('/lessons', colorController.getColorLessons);

// GET /api/colors/lessons/:lessonId - Get specific color lesson
// Returns detailed information about a specific color lesson
router.get('/lessons/:lessonId', colorController.getColorLesson);

// COLOR ACTIVITY ROUTES

// POST /api/colors/identify - Color identification activity
// Students click on colors to learn their names
// Body: { lessonId, selectedColor, userId }
router.post('/identify', colorController.colorIdentification);

// POST /api/colors/mix - Color mixing activity
// Students learn what happens when colors are mixed together
// Body: { lessonId, color1, color2, userId }
router.post('/mix', colorController.colorMixing);

// CHALLENGE ROUTES

// GET /api/colors/challenge - Get random color challenge
// Query parameters: ?grade=pre-k
// Generates random color-based challenges for students
router.get('/challenge', colorController.getColorChallenge);

// EXPORT THE ROUTER
// Makes these routes available to the main server
module.exports = router; 