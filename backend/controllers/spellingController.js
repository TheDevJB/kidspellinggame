const db = require('../config/data');

// Get a random spelling word
exports.getRandomWord = (req, res) => {
    try {
        const difficulty = req.query.difficulty || 'easy';
        const words = db.spellingWords.filter(word => word.difficulty === difficulty);
        const randomWord = words[Math.floor(Math.random() * words.length)];
        res.json(randomWord);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Check if spelling is correct
exports.checkSpelling = (req, res) => {
    try {
        const { wordId, attempt } = req.body;
        const word = db.spellingWords.find(w => w.id === wordId);
        
        if (!word) {
            return res.status(404).json({ message: 'Word not found' });
        }

        const isCorrect = word.word.toLowerCase() === attempt.toLowerCase();
        res.json({
            correct: isCorrect,
            word: word.word,
            hint: isCorrect ? null : word.hint
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add new spelling word (admin function)
exports.addWord = (req, res) => {
    try {
        const { word, difficulty, hint } = req.body;
        const newId = Math.max(...db.spellingWords.map(w => w.id)) + 1;
        
        const newWord = {
            id: newId,
            word,
            difficulty: difficulty || 'easy',
            hint: hint || ''
        };
        
        db.spellingWords.push(newWord);
        res.status(201).json(newWord);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
