const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'kids_spelling_game',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database successfully!');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Error connecting to MySQL database:', error.message);
    return false;
  }
}

// Initialize database tables
async function initializeDatabase() {
  try {
    // Create word_families table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS word_families (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        description TEXT,
        pattern VARCHAR(20),
        difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'easy',
        completed BOOLEAN DEFAULT FALSE,
        in_progress BOOLEAN DEFAULT FALSE,
        words_learned INT DEFAULT 0,
        total_words INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create words table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS words (
        id INT AUTO_INCREMENT PRIMARY KEY,
        word VARCHAR(100) NOT NULL,
        family_id INT,
        example_sentence TEXT,
        mastered BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (family_id) REFERENCES word_families(id) ON DELETE CASCADE
      )
    `);

    // Create users table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        grade VARCHAR(20),
        avatar VARCHAR(50) DEFAULT 'bear',
        total_points INT DEFAULT 0,
        streak_days INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create user_progress table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS user_progress (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        word_id INT,
        family_id INT,
        attempts INT DEFAULT 0,
        correct_attempts INT DEFAULT 0,
        mastered BOOLEAN DEFAULT FALSE,
        last_attempt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE,
        FOREIGN KEY (family_id) REFERENCES word_families(id) ON DELETE CASCADE
      )
    `);

    console.log('✅ Database tables initialized successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    return false;
  }
}

// Seed initial data
async function seedDatabase() {
  try {
    // Check if data already exists
    const [families] = await pool.execute('SELECT COUNT(*) as count FROM word_families');
    if (families[0].count > 0) {
      console.log('📚 Database already has data, skipping seed...');
      return;
    }

    // Insert word families
    const wordFamilies = [
      { name: 'AT', description: 'Words ending with -at sound', pattern: '_at', difficulty: 'easy', total_words: 8 },
      { name: 'AN', description: 'Words ending with -an sound', pattern: '_an', difficulty: 'easy', total_words: 8 },
      { name: 'ING', description: 'Words ending with -ing sound', pattern: '_ing', difficulty: 'medium', total_words: 8 },
      { name: 'OP', description: 'Words ending with -op sound', pattern: '_op', difficulty: 'easy', total_words: 6 },
      { name: 'UG', description: 'Words ending with -ug sound', pattern: '_ug', difficulty: 'easy', total_words: 6 },
      { name: 'ET', description: 'Words ending with -et sound', pattern: '_et', difficulty: 'medium', total_words: 6 },
      { name: 'ICK', description: 'Words ending with -ick sound', pattern: '_ick', difficulty: 'medium', total_words: 7 },
      { name: 'IGHT', description: 'Words ending with -ight sound', pattern: '_ight', difficulty: 'hard', total_words: 6 }
    ];

    for (const family of wordFamilies) {
      const [result] = await pool.execute(
        'INSERT INTO word_families (name, description, pattern, difficulty, total_words) VALUES (?, ?, ?, ?, ?)',
        [family.name, family.description, family.pattern, family.difficulty, family.total_words]
      );
      
      // Insert words for each family
      let words = [];
      if (family.name === 'AT') {
        words = [
          { word: 'cat', example_sentence: 'The cat is sleeping on the mat.' },
          { word: 'bat', example_sentence: 'The baseball bat is made of wood.' },
          { word: 'hat', example_sentence: 'She wore a red hat to the party.' },
          { word: 'mat', example_sentence: 'Please wipe your feet on the mat.' },
          { word: 'rat', example_sentence: 'The rat ran through the maze.' },
          { word: 'fat', example_sentence: 'The fat cat ate too much food.' },
          { word: 'sat', example_sentence: 'She sat on the comfortable chair.' },
          { word: 'pat', example_sentence: 'Give the dog a gentle pat.' }
        ];
      } else if (family.name === 'AN') {
        words = [
          { word: 'can', example_sentence: 'I can ride my bike to school.' },
          { word: 'man', example_sentence: 'The man walked his dog in the park.' },
          { word: 'pan', example_sentence: 'Cook the eggs in a frying pan.' },
          { word: 'ran', example_sentence: 'She ran as fast as she could.' },
          { word: 'fan', example_sentence: 'Turn on the fan to cool the room.' },
          { word: 'tan', example_sentence: 'His skin got tan from the sun.' },
          { word: 'van', example_sentence: 'The delivery van arrived on time.' },
          { word: 'plan', example_sentence: 'We need to make a plan for the trip.' }
        ];
      } else if (family.name === 'ING') {
        words = [
          { word: 'sing', example_sentence: 'The birds sing beautiful songs.' },
          { word: 'ring', example_sentence: 'The phone will ring when someone calls.' },
          { word: 'king', example_sentence: 'The king ruled the kingdom wisely.' },
          { word: 'wing', example_sentence: 'The bird flapped its wing to fly.' },
          { word: 'bring', example_sentence: 'Please bring your homework to class.' },
          { word: 'thing', example_sentence: 'What is that strange thing over there?' },
          { word: 'spring', example_sentence: 'Flowers bloom in the spring season.' },
          { word: 'swing', example_sentence: 'The children love to swing at the playground.' }
        ];
      } else if (family.name === 'OP') {
        words = [
          { word: 'hop', example_sentence: 'The bunny likes to hop around the yard.' },
          { word: 'top', example_sentence: 'The spinning top spun very fast.' },
          { word: 'pop', example_sentence: 'The balloon will pop if you squeeze it.' },
          { word: 'stop', example_sentence: 'Please stop at the red light.' },
          { word: 'shop', example_sentence: 'We went to shop for groceries.' },
          { word: 'drop', example_sentence: 'Be careful not to drop the glass.' }
        ];
      } else if (family.name === 'UG') {
        words = [
          { word: 'bug', example_sentence: 'The little bug crawled on the leaf.' },
          { word: 'hug', example_sentence: 'Mom gave me a warm hug.' },
          { word: 'mug', example_sentence: 'I drink hot chocolate from my favorite mug.' },
          { word: 'rug', example_sentence: 'The soft rug feels nice under my feet.' },
          { word: 'tug', example_sentence: 'The dog likes to tug on the rope.' },
          { word: 'jug', example_sentence: 'Pour the milk from the jug.' }
        ];
      } else if (family.name === 'ET') {
        words = [
          { word: 'pet', example_sentence: 'My pet dog loves to play fetch.' },
          { word: 'net', example_sentence: 'The fisherman cast his net into the water.' },
          { word: 'wet', example_sentence: 'My clothes got wet in the rain.' },
          { word: 'get', example_sentence: 'Can you get me a glass of water?' },
          { word: 'let', example_sentence: 'Please let me help you with that.' },
          { word: 'set', example_sentence: 'Set the table for dinner.' }
        ];
      } else if (family.name === 'ICK') {
        words = [
          { word: 'pick', example_sentence: 'Pick your favorite color crayon.' },
          { word: 'kick', example_sentence: 'Kick the soccer ball into the goal.' },
          { word: 'sick', example_sentence: 'I stayed home because I felt sick.' },
          { word: 'tick', example_sentence: 'The clock goes tick-tock.' },
          { word: 'quick', example_sentence: 'The quick rabbit ran away.' },
          { word: 'stick', example_sentence: 'The dog fetched the stick.' },
          { word: 'thick', example_sentence: 'The book has thick pages.' }
        ];
      } else if (family.name === 'IGHT') {
        words = [
          { word: 'light', example_sentence: 'Turn on the light so we can see.' },
          { word: 'night', example_sentence: 'The stars shine bright at night.' },
          { word: 'right', example_sentence: 'Turn right at the next corner.' },
          { word: 'sight', example_sentence: 'The sunset was a beautiful sight.' },
          { word: 'bright', example_sentence: 'The sun is very bright today.' },
          { word: 'fight', example_sentence: 'The knights would fight with swords.' }
        ];
      }

      for (const word of words) {
        await pool.execute(
          'INSERT INTO words (word, family_id, example_sentence) VALUES (?, ?, ?)',
          [word.word, result.insertId, word.example_sentence]
        );
      }
    }

    console.log('🌱 Database seeded with initial data successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
  }
}

module.exports = {
  pool,
  testConnection,
  initializeDatabase,
  seedDatabase
}; 