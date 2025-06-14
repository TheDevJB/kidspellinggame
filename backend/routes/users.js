const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register', userController.registerUser);

router.post('/login', userController.loginUser);

router.get('/:userId/profile', userController.getUserProfile);

router.put('/:userId/avatar', userController.updateUserAvatar);

router.post('/progress', userController.updateUserProgress);

router.get('/leaderboard', userController.getLeaderboard);

module.exports = router; 
