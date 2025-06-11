// COLOR LEARNING CONTROLLER
// Handles color identification, color mixing, and interactive color activities
// Designed for Pre-K and Kindergarten students

const db = require('../config/data');

// GET COLOR LESSONS BY GRADE
exports.getColorLessons = (req, res) => {
    try {
        // Get grade from query parameter or default to 'pre-k'
        const grade = req.query.grade || 'pre-k';
        
        // Filter color lessons by grade level
        const lessons = db.colorLessons.filter(lesson => lesson.grade === grade);
        
        if (lessons.length === 0) {
            return res.status(404).json({
                message: `No color lessons found for grade: ${grade}`,
                availableGrades: ['pre-k', 'kindergarten']
            });
        }
        
        res.json({
            message: 'Color lessons retrieved successfully',
            grade: grade,
            lessons: lessons
        });
        
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching color lessons',
            error: error.message
        });
    }
};

// GET SPECIFIC COLOR LESSON
exports.getColorLesson = (req, res) => {
    try {
        const lessonId = parseInt(req.params.lessonId);
        
        // Find the specific lesson
        const lesson = db.colorLessons.find(l => l.id === lessonId);
        
        if (!lesson) {
            return res.status(404).json({
                message: 'Color lesson not found',
                error: 'LESSON_NOT_FOUND'
            });
        }
        
        res.json({
            message: 'Color lesson retrieved successfully',
            lesson: lesson
        });
        
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching color lesson',
            error: error.message
        });
    }
};

// COLOR IDENTIFICATION ACTIVITY
// Student clicks on colors and learns their names
exports.colorIdentification = (req, res) => {
    try {
        const { lessonId, selectedColor, userId } = req.body;
        
        // Find the lesson
        const lesson = db.colorLessons.find(l => l.id === lessonId);
        
        if (!lesson || lesson.type !== 'identification') {
            return res.status(404).json({
                message: 'Color identification lesson not found',
                error: 'INVALID_LESSON'
            });
        }
        
        // Find the selected color in the lesson
        const colorData = lesson.colors.find(c => c.name === selectedColor);
        
        if (!colorData) {
            return res.status(400).json({
                message: 'Invalid color selection',
                error: 'INVALID_COLOR'
            });
        }
        
        // Generate a random color question
        const allColors = lesson.colors;
        const correctColor = allColors[Math.floor(Math.random() * allColors.length)];
        
        // Check if the selected color matches the question
        const isCorrect = selectedColor === correctColor.name;
        
        // Calculate points based on correctness
        const points = isCorrect ? 10 : 0;
        
        // Prepare response with encouragement
        const response = {
            correct: isCorrect,
            selectedColor: colorData,
            correctColor: correctColor,
            points: points,
            message: isCorrect ? 
                `Great job! You found ${correctColor.name}! 🌈` : 
                `Good try! That's ${selectedColor}, but we were looking for ${correctColor.name}. Keep going! 💪`,
            encouragement: isCorrect ? 
                ['Awesome!', 'Perfect!', 'You\'re amazing!', 'Fantastic!'][Math.floor(Math.random() * 4)] :
                ['Try again!', 'You can do it!', 'Keep learning!', 'Almost there!'][Math.floor(Math.random() * 4)]
        };
        
        // Update user progress if userId provided
        if (userId && isCorrect) {
            const progressIndex = db.userProgress.findIndex(p => 
                p.userId === userId && p.module === 'colors'
            );
            
            if (progressIndex !== -1) {
                db.userProgress[progressIndex].totalScore += points;
                db.userProgress[progressIndex].lastUpdated = new Date().toISOString();
                
                // Update user's total points
                const user = db.users.find(u => u.id === userId);
                if (user) {
                    user.totalPoints += points;
                    user.lastActive = new Date().toISOString();
                }
            }
        }
        
        res.json(response);
        
    } catch (error) {
        res.status(500).json({
            message: 'Error processing color identification',
            error: error.message
        });
    }
};

// COLOR MIXING ACTIVITY
// Students learn what happens when colors are mixed together
exports.colorMixing = (req, res) => {
    try {
        const { lessonId, color1, color2, userId } = req.body;
        
        // Find the color mixing lesson
        const lesson = db.colorLessons.find(l => l.id === lessonId);
        
        if (!lesson || lesson.type !== 'interactive') {
            return res.status(404).json({
                message: 'Color mixing lesson not found',
                error: 'INVALID_LESSON'
            });
        }
        
        // Validation: Check if both colors are provided
        if (!color1 || !color2) {
            return res.status(400).json({
                message: 'Two colors are required for mixing',
                error: 'MISSING_COLORS'
            });
        }
        
        // Find the mixing rule for these colors
        // Check both combinations: [color1, color2] and [color2, color1]
        let mixingRule = lesson.mixingRules.find(rule => 
            (rule.colors.includes(color1) && rule.colors.includes(color2)) &&
            rule.colors.length === 2
        );
        
        if (!mixingRule) {
            // If no rule found, these colors don't mix in this lesson
            return res.json({
                success: false,
                message: `Hmm, ${color1} and ${color2} don't make a new color in this lesson. Try different colors! 🎨`,
                color1: color1,
                color2: color2,
                result: null,
                points: 0,
                hint: 'Try mixing primary colors like red, blue, and yellow!'
            });
        }
        
        // Successful color mixing!
        const points = 15; // More points for interactive activities
        
        const response = {
            success: true,
            message: `Amazing! ${color1} + ${color2} = ${mixingRule.result}! 🎨✨`,
            color1: color1,
            color2: color2,
            result: mixingRule.result,
            points: points,
            encouragement: [
                'You\'re a color mixing master!',
                'Fantastic discovery!',
                'What a beautiful color!',
                'You\'re learning so much!'
            ][Math.floor(Math.random() * 4)]
        };
        
        // Update user progress
        if (userId) {
            const progressIndex = db.userProgress.findIndex(p => 
                p.userId === userId && p.module === 'colors'
            );
            
            if (progressIndex !== -1) {
                db.userProgress[progressIndex].totalScore += points;
                db.userProgress[progressIndex].lastUpdated = new Date().toISOString();
                
                // Update user's total points
                const user = db.users.find(u => u.id === userId);
                if (user) {
                    user.totalPoints += points;
                    user.lastActive = new Date().toISOString();
                }
            }
        }
        
        res.json(response);
        
    } catch (error) {
        res.status(500).json({
            message: 'Error processing color mixing',
            error: error.message
        });
    }
};

// GET RANDOM COLOR CHALLENGE
// Generates random color-based challenges for students
exports.getColorChallenge = (req, res) => {
    try {
        const grade = req.query.grade || 'pre-k';
        
        // Get lessons for the grade
        const lessons = db.colorLessons.filter(l => l.grade === grade);
        
        if (lessons.length === 0) {
            return res.status(404).json({
                message: 'No color lessons available for this grade',
                error: 'NO_LESSONS'
            });
        }
        
        // Pick a random lesson
        const randomLesson = lessons[Math.floor(Math.random() * lessons.length)];
        
        let challenge;
        
        if (randomLesson.type === 'identification') {
            // Create color identification challenge
            const randomColor = randomLesson.colors[Math.floor(Math.random() * randomLesson.colors.length)];
            
            challenge = {
                type: 'identification',
                lessonId: randomLesson.id,
                question: `Can you find the color ${randomColor.name}?`,
                targetColor: randomColor,
                options: randomLesson.colors,
                instruction: 'Click on the correct color!'
            };
            
        } else if (randomLesson.type === 'interactive') {
            // Create color mixing challenge
            const randomRule = randomLesson.mixingRules[Math.floor(Math.random() * randomLesson.mixingRules.length)];
            
            challenge = {
                type: 'mixing',
                lessonId: randomLesson.id,
                question: `What color do you get when you mix ${randomRule.colors[0]} and ${randomRule.colors[1]}?`,
                colors: randomRule.colors,
                instruction: 'Mix the colors and see what happens!'
            };
        }
        
        res.json({
            message: 'Color challenge generated successfully',
            challenge: challenge,
            lesson: {
                id: randomLesson.id,
                title: randomLesson.title,
                grade: randomLesson.grade
            }
        });
        
    } catch (error) {
        res.status(500).json({
            message: 'Error generating color challenge',
            error: error.message
        });
    }
}; 