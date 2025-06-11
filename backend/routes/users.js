// USER MANAGEMENT ROUTES
// Handles user registration, authentication, progress tracking, and profile management

const express = require('express'); // Express framework
const router = express.Router(); // Create a router object for user-related routes
const userController = require('../controllers/userController'); // Import user controller functions

// USER AUTHENTICATION ROUTES

// POST /api/users/register - Create new user account
// Used when a new student signs up for the learning platform
router.post('/register', userController.createUser);

// POST /api/users/login - User login
// Used when existing users want to access their account
router.post('/login', userController.loginUser);

// USER PROFILE ROUTES

// GET /api/users/:userId/profile - Get user profile with detailed stats
// Shows user info, progress across all modules, and achievements
router.get('/:userId/profile', userController.getUserProfile);

// PUT /api/users/:userId/avatar - Update user's avatar
// Allows users to change their character avatar (if they have enough points)
router.put('/:userId/avatar', userController.updateAvatar);

// PROGRESS TRACKING ROUTES

// POST /api/users/progress - Update user progress
// Called when a user completes a lesson or activity
router.post('/progress', userController.updateProgress);

// LEADERBOARD ROUTES

// GET /api/users/leaderboard - Get top users by points
// Shows the highest-scoring students for motivation
router.get('/leaderboard', userController.getLeaderboard);

// EXPORT THE ROUTER
// Makes these routes available to the main server
module.exports = router; 