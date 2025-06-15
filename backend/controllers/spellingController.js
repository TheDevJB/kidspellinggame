const { pool } = require('../config/database');

// Get all word families with their words
exports.getWordFamilies = async (req, res) => {
  try {
    const [families] = await pool.execute(`
      SELECT wf.*, 
             COUNT(w.id) as actual_word_count,
             COUNT(CASE WHEN w.mastered = 1 THEN 1 END) as mastered_count
      FROM word_families wf
      LEFT JOIN words w ON wf.id = w.family_id
      GROUP BY wf.id
      ORDER BY wf.difficulty, wf.name
    `);

    // Get words for each family
    for (let family of families) {
      const [words] = await pool.execute(
        'SELECT * FROM words WHERE family_id = ? ORDER BY word',
        [family.id]
      );
      family.words = words;
      family.words_learned = family.mastered_count;
      family.total_words = family.actual_word_count;
    }

    res.json(families);
  } catch (error) {
    console.error('Error fetching word families:', error);
    res.status(500).json({ message: 'Error fetching word families', error: error.message });
  }
};

// Get specific word family by ID
exports.getWordFamily = async (req, res) => {
  try {
    const familyId = parseInt(req.params.id);
    
    const [families] = await pool.execute(
      'SELECT * FROM word_families WHERE id = ?',
      [familyId]
    );

    if (families.length === 0) {
      return res.status(404).json({ message: 'Word family not found' });
    }

    const family = families[0];
    
    // Get words for this family
    const [words] = await pool.execute(
      'SELECT * FROM words WHERE family_id = ? ORDER BY word',
      [familyId]
    );

    family.words = words;
    family.words_learned = words.filter(w => w.mastered).length;
    family.total_words = words.length;

    res.json(family);
  } catch (error) {
    console.error('Error fetching word family:', error);
    res.status(500).json({ message: 'Error fetching word family', error: error.message });
  }
};

// Get spelling words with optional filtering
exports.getSpellingWords = async (req, res) => {
  try {
    const { grade, family, difficulty } = req.query;
    
    let query = `
      SELECT w.*, wf.name as family_name, wf.pattern, wf.difficulty
      FROM words w
      JOIN word_families wf ON w.family_id = wf.id
      WHERE 1=1
    `;
    const params = [];

    if (family) {
      query += ' AND wf.name = ?';
      params.push(family.toUpperCase());
    }

    if (difficulty) {
      query += ' AND wf.difficulty = ?';
      params.push(difficulty);
    }

    query += ' ORDER BY wf.difficulty, wf.name, w.word';

    const [words] = await pool.execute(query, params);
    res.json(words);
  } catch (error) {
    console.error('Error fetching spelling words:', error);
    res.status(500).json({ message: 'Error fetching spelling words', error: error.message });
  }
};

// Get random word
exports.getRandomWord = async (req, res) => {
  try {
    const { grade, family, difficulty } = req.query;
    
    let query = `
      SELECT w.*, wf.name as family_name, wf.pattern, wf.difficulty
      FROM words w
      JOIN word_families wf ON w.family_id = wf.id
      WHERE 1=1
    `;
    const params = [];

    if (family) {
      query += ' AND wf.name = ?';
      params.push(family.toUpperCase());
    }

    if (difficulty) {
      query += ' AND wf.difficulty = ?';
      params.push(difficulty);
    }

    query += ' ORDER BY RAND() LIMIT 1';

    const [words] = await pool.execute(query, params);
    
    if (words.length === 0) {
      return res.status(404).json({ message: 'No words found matching criteria' });
    }

    res.json(words[0]);
  } catch (error) {
    console.error('Error fetching random word:', error);
    res.status(500).json({ message: 'Error fetching random word', error: error.message });
  }
};

// Check spelling attempt
exports.checkSpelling = async (req, res) => {
  try {
    const { wordId, userAnswer, userId } = req.body;
    
    if (!wordId || !userAnswer) {
      return res.status(400).json({ message: 'Word ID and user answer are required' });
    }

    // Get the correct word
    const [words] = await pool.execute(
      'SELECT w.*, wf.name as family_name FROM words w JOIN word_families wf ON w.family_id = wf.id WHERE w.id = ?',
      [wordId]
    );

    if (words.length === 0) {
      return res.status(404).json({ message: 'Word not found' });
    }

    const word = words[0];
    const isCorrect = userAnswer.toLowerCase().trim() === word.word.toLowerCase();

    // If user ID is provided, track progress
    if (userId) {
      // Check if progress record exists
      const [existingProgress] = await pool.execute(
        'SELECT * FROM user_progress WHERE user_id = ? AND word_id = ?',
        [userId, wordId]
      );

      if (existingProgress.length > 0) {
        // Update existing progress
        const progress = existingProgress[0];
        await pool.execute(
          `UPDATE user_progress 
           SET attempts = attempts + 1, 
               correct_attempts = correct_attempts + ?, 
               mastered = CASE WHEN correct_attempts + ? >= 3 THEN 1 ELSE mastered END,
               last_attempt = CURRENT_TIMESTAMP
           WHERE user_id = ? AND word_id = ?`,
          [isCorrect ? 1 : 0, isCorrect ? 1 : 0, userId, wordId]
        );
      } else {
        // Create new progress record
        await pool.execute(
          `INSERT INTO user_progress (user_id, word_id, family_id, attempts, correct_attempts, mastered)
           VALUES (?, ?, ?, 1, ?, ?)`,
          [userId, wordId, word.family_id, isCorrect ? 1 : 0, isCorrect && 1]
        );
      }

      // Update word mastered status if needed
      if (isCorrect) {
        const [updatedProgress] = await pool.execute(
          'SELECT correct_attempts FROM user_progress WHERE user_id = ? AND word_id = ?',
          [userId, wordId]
        );
        
        if (updatedProgress[0].correct_attempts >= 3) {
          await pool.execute(
            'UPDATE words SET mastered = 1 WHERE id = ?',
            [wordId]
          );
        }
      }
    }

    res.json({
      correct: isCorrect,
      correctWord: word.word,
      userAnswer: userAnswer,
      familyName: word.family_name,
      exampleSentence: word.example_sentence
    });

  } catch (error) {
    console.error('Error checking spelling:', error);
    res.status(500).json({ message: 'Error checking spelling', error: error.message });
  }
};

// Get user progress for spelling
exports.getUserProgress = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    const [progress] = await pool.execute(`
      SELECT 
        wf.id as family_id,
        wf.name as family_name,
        wf.description,
        wf.difficulty,
        COUNT(w.id) as total_words,
        COUNT(CASE WHEN up.mastered = 1 THEN 1 END) as mastered_words,
        AVG(CASE WHEN up.attempts > 0 THEN (up.correct_attempts / up.attempts) * 100 ELSE 0 END) as accuracy
      FROM word_families wf
      LEFT JOIN words w ON wf.id = w.family_id
      LEFT JOIN user_progress up ON w.id = up.word_id AND up.user_id = ?
      GROUP BY wf.id, wf.name, wf.description, wf.difficulty
      ORDER BY wf.difficulty, wf.name
    `, [userId]);

    res.json(progress);
  } catch (error) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({ message: 'Error fetching user progress', error: error.message });
  }
};

// Add new word
exports.addWord = async (req, res) => {
  try {
    const { word, familyId, exampleSentence } = req.body;
    
    if (!word || !familyId) {
      return res.status(400).json({ message: 'Word and family ID are required' });
    }

    // Check if family exists
    const [families] = await pool.execute(
      'SELECT * FROM word_families WHERE id = ?',
      [familyId]
    );

    if (families.length === 0) {
      return res.status(404).json({ message: 'Word family not found' });
    }

    // Insert new word
    const [result] = await pool.execute(
      'INSERT INTO words (word, family_id, example_sentence) VALUES (?, ?, ?)',
      [word.toLowerCase(), familyId, exampleSentence || `Example sentence with ${word}.`]
    );

    // Update total_words count in word_families
    await pool.execute(
      'UPDATE word_families SET total_words = (SELECT COUNT(*) FROM words WHERE family_id = ?) WHERE id = ?',
      [familyId, familyId]
    );

    // Get the newly created word
    const [newWord] = await pool.execute(
      'SELECT w.*, wf.name as family_name FROM words w JOIN word_families wf ON w.family_id = wf.id WHERE w.id = ?',
      [result.insertId]
    );

    res.status(201).json(newWord[0]);
  } catch (error) {
    console.error('Error adding word:', error);
    res.status(500).json({ message: 'Error adding word', error: error.message });
  }
};
