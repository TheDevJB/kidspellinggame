// Simple in-memory data store
const db = {
    spellingWords: [
        { id: 1, word: 'cat', difficulty: 'easy', hint: 'A small furry pet' },
        { id: 2, word: 'dog', difficulty: 'easy', hint: 'A loyal pet' },
        { id: 3, word: 'elephant', difficulty: 'medium', hint: 'A large gray animal' }
    ],
    mathProblems: [
        { id: 1, question: '2 + 2', answer: 4, type: 'addition', difficulty: 'easy' },
        { id: 2, question: '5 - 3', answer: 2, type: 'subtraction', difficulty: 'easy' },
        { id: 3, question: '3 × 4', answer: 12, type: 'multiplication', difficulty: 'medium' }
    ]
};

module.exports = db;
