const express = require('express');
const router = express.Router();
const colorController = require('../controllers/colorController');

router.get('/lessons', colorController.getColorLessons);

router.get('/lessons/:lessonId', colorController.getColorLesson);

router.post('/identify', colorController.colorIdentification);

router.post('/mix', colorController.colorMixing);

router.get('/challenge', colorController.getColorChallenge);

module.exports = router; 
