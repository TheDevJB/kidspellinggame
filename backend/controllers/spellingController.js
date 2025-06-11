// Import the database/data configuration
const db = require('../config/data');

// CONTROLLER FUNCTIONS
// Controllers contain the business logic for your application
// They process requests, interact with data, and send responses
// This separates concerns: routes handle URLs, controllers handle logic

// ENHANCED SPELLING CONTROLLER
// Handles spelling activities with grade-level progression, word families, and detailed feedback
// Supports Pre-K through 5th grade with adaptive difficulty

// GET SPELLING WORDS BY GRADE AND FAMILY
exports.getSpellingWords = (req, res) => {
    try {
        // Extract query parameters with defaults
        const grade = req.query.grade || 'pre-k';
        const family = req.query.family; // Optional filter by word family
        const difficulty = req.query.difficulty; // Optional filter by difficulty
        
        // Start with all spelling words
        let words = db.spellingWords;
        
        // Filter by grade
        words = words.filter(word => word.grade === grade);
        
        // Filter by word family if specified
        if (family) {
            words = words.filter(word => word.family === family);
        }
        
        // Filter by difficulty if specified
        if (difficulty) {
            words = words.filter(word => word.difficulty === difficulty);
        }
        
        if (words.length === 0) {
            return res.status(404).json({
                message: `No spelling words found for the specified criteria`,
                criteria: { grade, family, difficulty },
                availableGrades: ['pre-k', 'kindergarten', '1st', '2nd', '3rd', '4th', '5th']
            });
        }
        
        res.json({
            message: 'Spelling words retrieved successfully',
            criteria: { grade, family, difficulty },
            count: words.length,
            words: words
        });
        
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching spelling words',
            error: error.message
        });
    }
};

// GET RANDOM SPELLING WORD (Enhanced version)
exports.getRandomWord = (req, res) => {
    try {
        // Extract parameters with enhanced options
        const grade = req.query.grade || 'pre-k';
        const family = req.query.family;
        const difficulty = req.query.difficulty;
        const userId = req.query.userId; // For personalized word selection
        
        // Filter words based on criteria
        let availableWords = db.spellingWords.filter(word => word.grade === grade);
        
        if (family) {
            availableWords = availableWords.filter(word => word.family === family);
        }
        
        if (difficulty) {
            availableWords = availableWords.filter(word => word.difficulty === difficulty);
        }
        
        if (availableWords.length === 0) {
            return res.status(404).json({
                message: 'No words available for the specified criteria',
                criteria: { grade, family, difficulty }
            });
        }
        
        // If userId provided, try to avoid recently practiced words
        if (userId) {
            // This would be enhanced with a "recently practiced" tracking system
            // For now, we'll just select randomly
        }
        
        // Select random word
        const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
        
        // Prepare response with educational context
        const response = {
            word: {
                id: randomWord.id,
                word: randomWord.word,
                grade: randomWord.grade,
                difficulty: randomWord.difficulty,
                family: randomWord.family,
                hint: randomWord.hint,
                sentence: randomWord.sentence,
                audio: randomWord.audio
            },
            instructions: {
                message: `Spell the word: "${randomWord.word}"`,
                hint: `Hint: ${randomWord.hint}`,
                sentence: `Example: ${randomWord.sentence}`,
                family: `Word family: -${randomWord.family}`
            },
            metadata: {
                totalWordsInGrade: db.spellingWords.filter(w => w.grade === grade).length,
                totalWordsInFamily: db.spellingWords.filter(w => w.family === randomWord.family).length
            }
        };
        
        res.json(response);
        
    } catch (error) {
        res.status(500).json({
            message: 'Error getting random word',
            error: error.message
        });
    }
};

// CHECK SPELLING (Enhanced with detailed feedback)
exports.checkSpelling = (req, res) => {
    try {
        const { wordId, attempt, userId, timeSpent } = req.body;
        
        // Find the word in database
        const word = db.spellingWords.find(w => w.id === wordId);
        
        if (!word) {
            return res.status(404).json({
                message: 'Word not found',
                error: 'WORD_NOT_FOUND'
            });
        }
        
        // Validation: Check if attempt is provided
        if (!attempt || typeof attempt !== 'string') {
            return res.status(400).json({
                message: 'Please provide a spelling attempt',
                error: 'MISSING_ATTEMPT'
            });
        }
        
        // Check if spelling is correct (case-insensitive)
        const isCorrect = word.word.toLowerCase() === attempt.toLowerCase();
        
        // Calculate points based on grade level and correctness
        const gradePoints = {
            'pre-k': 10,
            'kindergarten': 12,
            '1st': 15,
            '2nd': 18,
            '3rd': 20,
            '4th': 25,
            '5th': 30
        };
        
        const basePoints = gradePoints[word.grade] || 10;
        const points = isCorrect ? basePoints : Math.floor(basePoints * 0.3); // Partial points for trying
        
        // Analyze the spelling attempt for detailed feedback
        let feedback = {
            correct: isCorrect,
            attempt: attempt,
            correctSpelling: word.word,
            points: points,
            word: {
                id: word.id,
                word: word.word,
                grade: word.grade,
                family: word.family,
                hint: word.hint,
                sentence: word.sentence
            }
        };
        
        if (isCorrect) {
            // Correct spelling feedback
            feedback.message = `🎉 Perfect! You spelled "${word.word}" correctly!`;
            feedback.encouragement = [
                'Excellent spelling!',
                'You\'re a spelling star!',
                'Amazing work!',
                'Keep up the great spelling!',
                'You\'re getting better and better!'
            ][Math.floor(Math.random() * 5)];
            
            // Bonus points for difficult words
            if (word.difficulty === 'hard' || word.difficulty === 'expert') {
                const bonusPoints = Math.floor(basePoints * 0.5);
                feedback.points += bonusPoints;
                feedback.bonus = {
                    points: bonusPoints,
                    reason: `Bonus for spelling a ${word.difficulty} word!`
                };
            }
            
        } else {
            // Incorrect spelling feedback with helpful analysis
            feedback.message = `Good try! The correct spelling is "${word.word}".`;
            feedback.encouragement = 'Keep practicing! You\'re learning!';
            
            // Provide specific feedback about the mistake
            feedback.analysis = analyzeSpellingMistake(attempt, word.word);
            feedback.hint = word.hint;
            feedback.practiceAdvice = `Try focusing on the "${word.family}" word family pattern.`;
        }
        
        // Update user progress if userId provided
        if (userId) {
            updateUserSpellingProgress(userId, word, isCorrect, points, timeSpent);
        }
        
        res.json(feedback);
        
    } catch (error) {
        res.status(500).json({
            message: 'Error checking spelling',
            error: error.message
        });
    }
};

// GET WORD FAMILIES BY GRADE
exports.getWordFamilies = (req, res) => {
    try {
        const grade = req.query.grade || 'pre-k';
        
        // Filter word families by grade
        const families = db.wordFamilies.filter(family => family.grade === grade);
        
        if (families.length === 0) {
            return res.status(404).json({
                message: `No word families found for grade: ${grade}`,
                availableGrades: ['pre-k', 'kindergarten', '1st', '2nd', '3rd', '4th', '5th']
            });
        }
        
        // Enhance families with word counts and progress info
        const enhancedFamilies = families.map(family => ({
            ...family,
            wordCount: family.words.length,
            availableWords: db.spellingWords.filter(w => w.family === family.family && w.grade === grade).length
        }));
        
        res.json({
            message: 'Word families retrieved successfully',
            grade: grade,
            families: enhancedFamilies
        });
        
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching word families',
            error: error.message
        });
    }
};

// ADD NEW SPELLING WORD (Enhanced admin function)
exports.addWord = (req, res) => {
    try {
        const { word, grade, difficulty, family, hint, sentence, audio } = req.body;
        
        // Enhanced validation
        if (!word || !grade || !family) {
            return res.status(400).json({
                message: 'Word, grade, and family are required fields',
                error: 'MISSING_REQUIRED_FIELDS',
                required: ['word', 'grade', 'family']
            });
        }
        
        // Validate grade
        const validGrades = ['pre-k', 'kindergarten', '1st', '2nd', '3rd', '4th', '5th'];
        if (!validGrades.includes(grade)) {
            return res.status(400).json({
                message: 'Invalid grade level',
                error: 'INVALID_GRADE',
                validGrades: validGrades
            });
        }
        
        // Check if word already exists
        const existingWord = db.spellingWords.find(w => 
            w.word.toLowerCase() === word.toLowerCase() && w.grade === grade
        );
        
        if (existingWord) {
            return res.status(400).json({
                message: 'Word already exists for this grade level',
                error: 'DUPLICATE_WORD',
                existingWord: existingWord
            });
        }
        
        // Generate new ID
        const newId = Math.max(...db.spellingWords.map(w => w.id), 0) + 1;
        
        // Create new word object
        const newWord = {
            id: newId,
            word: word.toLowerCase(),
            grade: grade,
            difficulty: difficulty || 'easy',
            family: family,
            hint: hint || `A word that rhymes with ${family}`,
            sentence: sentence || `Here is the word ${word} in a sentence.`,
            audio: audio || `${word.toLowerCase()}.mp3`
        };
        
        // Add to database
        db.spellingWords.push(newWord);
        
        // Update word family if it exists
        const familyIndex = db.wordFamilies.findIndex(f => f.family === family && f.grade === grade);
        if (familyIndex !== -1 && !db.wordFamilies[familyIndex].words.includes(word.toLowerCase())) {
            db.wordFamilies[familyIndex].words.push(word.toLowerCase());
        }
        
        res.status(201).json({
            message: 'Spelling word added successfully',
            word: newWord
        });
        
    } catch (error) {
        res.status(500).json({
            message: 'Error adding spelling word',
            error: error.message
        });
    }
};

// GET SPELLING PROGRESS FOR USER
exports.getUserSpellingProgress = (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        
        // Find user's spelling progress
        const progress = db.userProgress.find(p => 
            p.userId === userId && p.module === 'spelling'
        );
        
        if (!progress) {
            return res.status(404).json({
                message: 'No spelling progress found for this user',
                error: 'PROGRESS_NOT_FOUND'
            });
        }
        
        // Get user info
        const user = db.users.find(u => u.id === userId);
        
        // Calculate detailed statistics
        const gradeWords = db.spellingWords.filter(w => w.grade === progress.grade);
        const completedWords = progress.completedLessons.length;
        const totalWords = gradeWords.length;
        const progressPercentage = Math.round((completedWords / totalWords) * 100);
        
        // Get word family progress
        const wordFamilies = db.wordFamilies.filter(f => f.grade === progress.grade);
        const familyProgress = wordFamilies.map(family => {
            const familyWords = gradeWords.filter(w => w.family === family.family);
            const completedFamilyWords = progress.completedLessons.filter(lesson => 
                familyWords.some(w => `spelling-${w.id}` === lesson)
            );
            
            return {
                family: family.family,
                totalWords: familyWords.length,
                completedWords: completedFamilyWords.length,
                progress: Math.round((completedFamilyWords.length / familyWords.length) * 100),
                color: family.color
            };
        });
        
        res.json({
            message: 'Spelling progress retrieved successfully',
            user: {
                id: user.id,
                name: user.name,
                grade: user.grade
            },
            progress: {
                module: 'spelling',
                grade: progress.grade,
                totalScore: progress.totalScore,
                timeSpent: progress.timeSpent,
                timeSpentFormatted: Math.floor(progress.timeSpent / 60) + ' minutes',
                completedWords: completedWords,
                totalWords: totalWords,
                progressPercentage: progressPercentage,
                lastUpdated: progress.lastUpdated
            },
            familyProgress: familyProgress,
            achievements: calculateSpellingAchievements(progress, completedWords)
        });
        
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching spelling progress',
            error: error.message
        });
    }
};

// HELPER FUNCTIONS

// Analyze spelling mistakes to provide helpful feedback
function analyzeSpellingMistake(attempt, correct) {
    const analysis = {
        length: attempt.length === correct.length ? 'correct' : 'incorrect',
        firstLetter: attempt[0]?.toLowerCase() === correct[0]?.toLowerCase() ? 'correct' : 'incorrect',
        lastLetter: attempt[attempt.length - 1]?.toLowerCase() === correct[correct.length - 1]?.toLowerCase() ? 'correct' : 'incorrect',
        suggestions: []
    };
    
    // Simple suggestions based on common mistakes
    if (analysis.length === 'incorrect') {
        if (attempt.length < correct.length) {
            analysis.suggestions.push('Try adding more letters');
        } else {
            analysis.suggestions.push('Try using fewer letters');
        }
    }
    
    if (analysis.firstLetter === 'incorrect') {
        analysis.suggestions.push(`Try starting with "${correct[0].toUpperCase()}"`);
    }
    
    if (analysis.lastLetter === 'incorrect') {
        analysis.suggestions.push(`Try ending with "${correct[correct.length - 1]}"`);
    }
    
    return analysis;
}

// Update user's spelling progress
function updateUserSpellingProgress(userId, word, isCorrect, points, timeSpent) {
    const progressIndex = db.userProgress.findIndex(p => 
        p.userId === userId && p.module === 'spelling'
    );
    
    if (progressIndex !== -1) {
        const progress = db.userProgress[progressIndex];
        
        // Update score and time
        progress.totalScore += points;
        if (timeSpent) progress.timeSpent += timeSpent;
        progress.lastUpdated = new Date().toISOString();
        
        // Mark word as completed if correct and not already completed
        if (isCorrect) {
            const lessonName = `spelling-${word.id}`;
            if (!progress.completedLessons.includes(lessonName)) {
                progress.completedLessons.push(lessonName);
            }
        }
        
        // Update user's total points
        const user = db.users.find(u => u.id === userId);
        if (user) {
            user.totalPoints += points;
            user.lastActive = new Date().toISOString();
        }
    }
}

// Calculate spelling achievements
function calculateSpellingAchievements(progress, completedWords) {
    const achievements = [];
    
    // Word count achievements
    if (completedWords >= 10) achievements.push('Spelled 10 words correctly! 🌟');
    if (completedWords >= 25) achievements.push('Spelling Bee Champion! 🐝');
    if (completedWords >= 50) achievements.push('Word Master! 📚');
    
    // Score achievements
    if (progress.totalScore >= 100) achievements.push('100 Points Club! 💯');
    if (progress.totalScore >= 500) achievements.push('Spelling Superstar! ⭐');
    
    return achievements;
}
