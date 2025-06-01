// Math Problem model structure
class MathProblem {
    constructor(id, question, answer, difficulty, type) {
        this.id = id;
        this.question = question;
        this.answer = answer;
        this.difficulty = difficulty || 'easy';
        this.type = type;
    }
}

module.exports = MathProblem;
