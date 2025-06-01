const db = require('../config/data');

// Get a random math problem
exports.getRandomProblem = (req, res) => {
    try {
        const difficulty = req.query.difficulty || 'easy';
        const type = req.query.type || 'addition';
        
        const problems = db.mathProblems.filter(p => 
            p.difficulty === difficulty && p.type === type
        );
        const randomProblem = problems[Math.floor(Math.random() * problems.length)];
        res.json(randomProblem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Check math answer
exports.checkAnswer = (req, res) => {
    try {
        const { problemId, answer } = req.body;
        const problem = db.mathProblems.find(p => p.id === problemId);
        
        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }

        const isCorrect = Number(answer) === problem.answer;
        res.json({
            correct: isCorrect,
            correctAnswer: isCorrect ? null : problem.answer
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add new math problem (admin function)
exports.addProblem = (req, res) => {
    try {
        const { question, answer, type, difficulty } = req.body;
        const newId = Math.max(...db.mathProblems.map(p => p.id)) + 1;
        
        const newProblem = {
            id: newId,
            question,
            answer: Number(answer),
            type: type || 'addition',
            difficulty: difficulty || 'easy'
        };
        
        db.mathProblems.push(newProblem);
        res.status(201).json(newProblem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
