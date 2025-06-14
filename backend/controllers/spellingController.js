const db = require('../config/data');



exports.getSpellingWords = (req, res) => {
    try {
        const grade = req.query.grade || 'pre-k';
        const family = req.query.family;
        const difficulty = req.query.difficulty;
        
        let words = db.spellingWords;
        
        words = words.filter(word => word.grade === grade);
        
        if (family) {
            words = words.filter(word => word.family === family);
        }
        
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

exports.getRandomWord = (req, res) => {
    try {
        const grade = req.query.grade || 'pre-k';
        const family = req.query.family;
        const difficulty = req.query.difficulty;
        const userId = req.query.userId;
        
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
        
        if (userId) {
        }
        
        const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
        
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

exports.checkSpelling = (req, res) => {
    try {
        const { wordId, attempt, userId, timeSpent } = req.body;
        
        const word = db.spellingWords.find(w => w.id === wordId);
        
        if (!word) {
            return res.status(404).json({
                message: 'Word not found',
                error: 'WORD_NOT_FOUND'
            });
        }
        
        if (!attempt || typeof attempt !== 'string') {
            return res.status(400).json({
                message: 'Please provide a spelling attempt',
                error: 'MISSING_ATTEMPT'
            });
        }
        
        const isCorrect = word.word.toLowerCase() === attempt.toLowerCase();
        
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
        const points = isCorrect ? basePoints : Math.floor(basePoints * 0.3);
        
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
            feedback.message = `🎉 Perfect! You spelled "${word.word}" correctly!`;
            feedback.encouragement = [
                'Excellent spelling!',
                'You\'re a spelling star!',
                'Amazing work!',
                'Keep up the great spelling!',
                'You\'re getting better and better!'
            ][Math.floor(Math.random() * 5)];
            
            if (word.difficulty === 'hard' || word.difficulty === 'expert') {
                const bonusPoints = Math.floor(basePoints * 0.5);
                feedback.points += bonusPoints;
                feedback.bonus = {
                    points: bonusPoints,
                    reason: `Bonus for spelling a ${word.difficulty} word!`
                };
            }
            
        } else {
            feedback.message = `Good try! The correct spelling is "${word.word}".`;
            feedback.encouragement = 'Keep practicing! You\'re learning!';
            
            feedback.analysis = analyzeSpellingMistake(attempt, word.word);
            feedback.hint = word.hint;
            feedback.practiceAdvice = `Try focusing on the "${word.family}" word family pattern.`;
        }
        
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

exports.getWordFamilies = (req, res) => {
    try {
        const grade = req.query.grade || 'pre-k';
        
        const families = db.wordFamilies.filter(family => family.grade === grade);
        
        if (families.length === 0) {
            return res.status(404).json({
                message: `No word families found for grade: ${grade}`,
                availableGrades: ['pre-k', 'kindergarten', '1st', '2nd', '3rd', '4th', '5th']
            });
        }
        
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

exports.addWord = (req, res) => {
    try {
        const { word, grade, difficulty, family, hint, sentence, audio } = req.body;
        
        if (!word || !grade || !family) {
            return res.status(400).json({
                message: 'Word, grade, and family are required fields',
                error: 'MISSING_REQUIRED_FIELDS',
                required: ['word', 'grade', 'family']
            });
        }
        
        const validGrades = ['pre-k', 'kindergarten', '1st', '2nd', '3rd', '4th', '5th'];
        if (!validGrades.includes(grade)) {
            return res.status(400).json({
                message: 'Invalid grade level',
                error: 'INVALID_GRADE',
                validGrades: validGrades
            });
        }
        
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
        
        const newId = Math.max(...db.spellingWords.map(w => w.id), 0) + 1;
        
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
        
        db.spellingWords.push(newWord);
        
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

exports.getUserSpellingProgress = (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        
        const progress = db.userProgress.find(p => 
            p.userId === userId && p.module === 'spelling'
        );
        
        if (!progress) {
            return res.status(404).json({
                message: 'No spelling progress found for this user',
                error: 'PROGRESS_NOT_FOUND'
            });
        }
        
        const user = db.users.find(u => u.id === userId);
        
        const gradeWords = db.spellingWords.filter(w => w.grade === progress.grade);
        const completedWords = progress.completedLessons.length;
        const totalWords = gradeWords.length;
        const progressPercentage = Math.round((completedWords / totalWords) * 100);
        
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


function analyzeSpellingMistake(attempt, correct) {
    const analysis = {
        length: attempt.length === correct.length ? 'correct' : 'incorrect',
        firstLetter: attempt[0]?.toLowerCase() === correct[0]?.toLowerCase() ? 'correct' : 'incorrect',
        lastLetter: attempt[attempt.length - 1]?.toLowerCase() === correct[correct.length - 1]?.toLowerCase() ? 'correct' : 'incorrect',
        suggestions: []
    };
    
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

function updateUserSpellingProgress(userId, word, isCorrect, points, timeSpent) {
    const progressIndex = db.userProgress.findIndex(p => 
        p.userId === userId && p.module === 'spelling'
    );
    
    if (progressIndex !== -1) {
        const progress = db.userProgress[progressIndex];
        
        progress.totalScore += points;
        if (timeSpent) progress.timeSpent += timeSpent;
        progress.lastUpdated = new Date().toISOString();
        
        if (isCorrect) {
            const lessonName = `spelling-${word.id}`;
            if (!progress.completedLessons.includes(lessonName)) {
                progress.completedLessons.push(lessonName);
            }
        }
        
        const user = db.users.find(u => u.id === userId);
        if (user) {
            user.totalPoints += points;
            user.lastActive = new Date().toISOString();
        }
    }
}

function calculateSpellingAchievements(progress, completedWords) {
    const achievements = [];
    
    if (completedWords >= 10) achievements.push('Spelled 10 words correctly! 🌟');
    if (completedWords >= 25) achievements.push('Spelling Bee Champion! 🐝');
    if (completedWords >= 50) achievements.push('Word Master! 📚');
    
    if (progress.totalScore >= 100) achievements.push('100 Points Club! 💯');
    if (progress.totalScore >= 500) achievements.push('Spelling Superstar! ⭐');
    
    return achievements;
}
