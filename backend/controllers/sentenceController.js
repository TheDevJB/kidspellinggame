
const db = require('../config/data');

exports.getSentenceActivities = (req, res) => {
    try {
        const grade = req.query.grade || 'kindergarten';
        
        const activities = db.sentenceActivities.filter(activity => activity.grade === grade);
        
        if (activities.length === 0) {
            return res.status(404).json({
                message: `No sentence activities found for grade: ${grade}`,
                availableGrades: ['kindergarten', '1st', '2nd', '3rd', '4th', '5th']
            });
        }
        
        res.json({
            message: 'Sentence activities retrieved successfully',
            grade: grade,
            activities: activities
        });
        
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching sentence activities',
            error: error.message
        });
    }
};

exports.checkWordOrder = (req, res) => {
    try {
        const { activityId, userSentence, userId } = req.body;
        
        const activity = db.sentenceActivities.find(a => a.id === activityId);
        
        if (!activity || activity.type !== 'word-order') {
            return res.status(404).json({
                message: 'Word order activity not found',
                error: 'INVALID_ACTIVITY'
            });
        }
        
        if (!userSentence || !Array.isArray(userSentence)) {
            return res.status(400).json({
                message: 'Please provide the sentence as an array of words',
                error: 'INVALID_INPUT',
                example: ['The', 'cat', 'is', 'sleeping']
            });
        }
        
        const userSentenceString = userSentence.join(' ');
        const isCorrect = userSentenceString === activity.correctSentence;
        
        const basePoints = 20;
        const points = isCorrect ? Math.round(basePoints) : 0;
        
        let feedback = {
            correct: isCorrect,
            userSentence: userSentenceString,
            correctSentence: activity.correctSentence,
            points: points,
            scrambledWords: activity.scrambledWords,
            hint: activity.hint
        };
        
        if (isCorrect) {
            feedback.message = 'Perfect! You built the sentence correctly! 🎉';
            feedback.encouragement = [
                'Excellent sentence building!',
                'You\'re a word wizard!',
                'Amazing work!',
                'You understand word order perfectly!'
            ][Math.floor(Math.random() * 4)];
        } else {
            feedback.message = 'Good try! Let\'s look at the correct order.';
            feedback.encouragement = 'Keep practicing! You\'re getting better!';
            
            if (userSentence.length !== activity.scrambledWords.length) {
                feedback.specificFeedback = 'Make sure to use all the words provided.';
            } else {
                feedback.specificFeedback = `Try starting with "${activity.hint || 'the first word'}"`;
            }
        }
        
        if (userId && isCorrect) {
            const progressIndex = db.userProgress.findIndex(p => 
                p.userId === userId && p.module === 'sentences'
            );
            
            if (progressIndex !== -1) {
                db.userProgress[progressIndex].totalScore += points;
                db.userProgress[progressIndex].lastUpdated = new Date().toISOString();
                
                const lessonName = `word-order-${activityId}`;
                if (!db.userProgress[progressIndex].completedLessons.includes(lessonName)) {
                    db.userProgress[progressIndex].completedLessons.push(lessonName);
                }
                
                const user = db.users.find(u => u.id === userId);
                if (user) {
                    user.totalPoints += points;
                    user.lastActive = new Date().toISOString();
                }
            }
        }
        
        res.json(feedback);
        
    } catch (error) {
        res.status(500).json({
            message: 'Error checking word order',
            error: error.message
        });
    }
};

exports.checkFillBlank = (req, res) => {
    try {
        const { activityId, selectedWord, userId } = req.body;
        
        const activity = db.sentenceActivities.find(a => a.id === activityId);
        
        if (!activity || activity.type !== 'fill-blank') {
            return res.status(404).json({
                message: 'Fill-in-the-blank activity not found',
                error: 'INVALID_ACTIVITY'
            });
        }
        
        const isCorrect = selectedWord === activity.correct;
        
        const basePoints = 15;
        const points = isCorrect ? Math.round(basePoints) : 0;
        
        const completedSentence = activity.sentence.replace('_____', selectedWord);
        const correctSentence = activity.sentence.replace('_____', activity.correct);
        
        let feedback = {
            correct: isCorrect,
            selectedWord: selectedWord,
            correctWord: activity.correct,
            completedSentence: completedSentence,
            correctSentence: correctSentence,
            points: points,
            options: activity.options,
            hint: activity.hint
        };
        
        if (isCorrect) {
            feedback.message = `Excellent! "${selectedWord}" is the perfect word! ✨`;
            feedback.encouragement = [
                'You have great grammar skills!',
                'Perfect word choice!',
                'You understand sentences well'
            ][Math.floor(Math.random() * 4)];
        } else {
            feedback.message = `Good try! The correct word is "${activity.correct}".`;
            feedback.encouragement = 'Keep practicing! You\'re learning!';
            feedback.explanation = activity.hint || 'Think about what makes sense in this sentence.';
        }
        
        if (userId && isCorrect) {
            const progressIndex = db.userProgress.findIndex(p => 
                p.userId === userId && p.module === 'sentences'
            );
            
            if (progressIndex !== -1) {
                db.userProgress[progressIndex].totalScore += points;
                db.userProgress[progressIndex].lastUpdated = new Date().toISOString();
                
                const user = db.users.find(u => u.id === userId);
                if (user) {
                    user.totalPoints += points;
                    user.lastActive = new Date().toISOString();
                }
            }
        }
        
        res.json(feedback);
        
    } catch (error) {
        res.status(500).json({
            message: 'Error checking fill-in-the-blank',
            error: error.message
        });
    }
};

exports.checkCapitalization = (req, res) => {
    try {
        const { activityId, userSentence, userId } = req.body;
        
        const activity = db.sentenceActivities.find(a => a.id === activityId);
        
        if (!activity || activity.type !== 'capitalization') {
            return res.status(404).json({
                message: 'Capitalization activity not found',
                error: 'INVALID_ACTIVITY'
            });
        }
        
        const isCorrect = userSentence === activity.correctSentence;
        
        const basePoints = 25;
        const points = isCorrect ? Math.round(basePoints) : 0;
        
        let errorAnalysis = [];
        if (!isCorrect) {
            activity.errors.forEach(errorWord => {
                const correctWord = errorWord.charAt(0).toUpperCase() + errorWord.slice(1);
                if (userSentence.includes(errorWord)) {
                    errorAnalysis.push({
                        wrong: errorWord,
                        correct: correctWord,
                        found: true
                    });
                }
            });
        }
        
        let feedback = {
            correct: isCorrect,
            userSentence: userSentence,
            correctSentence: activity.correctSentence,
            originalSentence: activity.sentence,
            points: points,
            rule: activity.rule,
            errors: activity.errors
        };
        
        if (isCorrect) {
            feedback.message = 'Perfect capitalization! You know the rules! 📝✨';
            feedback.encouragement = [
                'You\'re a capitalization champion!',
                'Excellent attention to detail!',
                'You understand the rules perfectly!',
                'Amazing grammar skills!'
            ][Math.floor(Math.random() * 4)];
        } else {
            feedback.message = 'Good effort! Let\'s review the capitalization rules.';
            feedback.encouragement = 'Keep practicing! You\'re improving!';
            feedback.errorAnalysis = errorAnalysis;
            feedback.ruleReminder = activity.rule;
            
            if (errorAnalysis.length > 0) {
                feedback.specificHelp = `Remember to capitalize: ${errorAnalysis.map(e => e.correct).join(', ')}`;
            }
        }
        
        if (userId && isCorrect) {
            const progressIndex = db.userProgress.findIndex(p => 
                p.userId === userId && p.module === 'capitalization'
            );
            
            if (progressIndex !== -1) {
                db.userProgress[progressIndex].totalScore += points;
                db.userProgress[progressIndex].lastUpdated = new Date().toISOString();
                
                const lessonName = `capitalization-${activityId}`;
                if (!db.userProgress[progressIndex].completedLessons.includes(lessonName)) {
                    db.userProgress[progressIndex].completedLessons.push(lessonName);
                }
                
                const user = db.users.find(u => u.id === userId);
                if (user) {
                    user.totalPoints += points;
                    user.lastActive = new Date().toISOString();
                }
            }
        }
        
        res.json(feedback);
        
    } catch (error) {
        res.status(500).json({
            message: 'Error checking capitalization',
            error: error.message
        });
    }
};

exports.getCapitalizationRules = (req, res) => {
    try {
        const grade = req.query.grade || 'kindergarten';
        
        const rules = db.capitalizationRules.filter(rule => rule.grade === grade);
        
        if (rules.length === 0) {
            return res.status(404).json({
                message: `No capitalization rules found for grade: ${grade}`,
                availableGrades: ['kindergarten', '1st', '2nd', '3rd', '4th', '5th']
            });
        }
        
        res.json({
            message: 'Capitalization rules retrieved successfully',
            grade: grade,
            rules: rules
        });
        
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching capitalization rules',
            error: error.message
        });
    }
};

exports.getRandomSentenceChallenge = (req, res) => {
    try {
        const grade = req.query.grade || 'kindergarten';
        
        const activities = db.sentenceActivities.filter(a => a.grade === grade);
        
        if (activities.length === 0) {
            return res.status(404).json({
                message: 'No sentence activities available for this grade',
                error: 'NO_ACTIVITIES'
            });
        }
        
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        
        let challenge = {
            id: randomActivity.id,
            type: randomActivity.type,
            grade: randomActivity.grade
        };
        
        switch (randomActivity.type) {
            case 'word-order':
                challenge.instruction = 'Put these words in the correct order to make a sentence:';
                challenge.scrambledWords = randomActivity.scrambledWords;
                challenge.hint = randomActivity.hint;
                break;
                
            case 'fill-blank':
                challenge.instruction = 'Choose the correct word to complete the sentence:';
                challenge.sentence = randomActivity.sentence;
                challenge.options = randomActivity.options;
                challenge.hint = randomActivity.hint;
                break;
                
            case 'capitalization':
                challenge.instruction = 'Fix the capitalization in this sentence:';
                challenge.sentence = randomActivity.sentence;
                challenge.rule = randomActivity.rule;
                break;
        }
        
        res.json({
            message: 'Sentence challenge generated successfully',
            challenge: challenge
        });
        
    } catch (error) {
        res.status(500).json({
            message: 'Error generating sentence challenge',
            error: error.message
        });
    }
}; 
