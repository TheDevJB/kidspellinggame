// Spelling Word model structure
class SpellingWord {
    constructor(id, word, difficulty, hint, category) {
        this.id = id;
        this.word = word;
        this.difficulty = difficulty || 'easy';
        this.hint = hint;
        this.category = category;
    }
}

module.exports = SpellingWord;
