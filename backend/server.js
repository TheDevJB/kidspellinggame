const express = require('express');
const app = express();
const cors = require('cors');
const { testConnection, initializeDatabase, seedDatabase } = require('./config/database');
require('dotenv').config();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/spelling', require('./routes/spelling'));
app.use('/api/colors', require('./routes/colors'));
app.use('/api/sentences', require('./routes/sentences'));
app.use('/api/math', require('./routes/math'));

app.use('/api/users', require('./routes/users'));

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Kids Learning Platform API is running!',
    version: '2.0.0',
    features: ['spelling', 'colors', 'sentences', 'capitalization', 'user-management']
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Kids Learning Platform API - Pre-K through 5th Grade',
    version: '2.0.0',
    description: 'Comprehensive educational API supporting multiple learning modules with progress tracking',
    endpoints: {
      health: '/api/health',
      
      users: {
        register: 'POST /api/users/register',
        login: 'POST /api/users/login',
        profile: 'GET /api/users/:userId/profile',
        updateAvatar: 'PUT /api/users/:userId/avatar',
        updateProgress: 'POST /api/users/progress',
        leaderboard: 'GET /api/users/leaderboard'
      },
      
      spelling: {
        words: 'GET /api/spelling/words?grade=pre-k&family=at',
        randomWord: 'GET /api/spelling/word?grade=pre-k',
        wordFamilies: 'GET /api/spelling/families?grade=pre-k',
        checkSpelling: 'POST /api/spelling/check',
        userProgress: 'GET /api/spelling/progress/:userId',
        addWord: 'POST /api/spelling/add'
      },
      
      colors: {
        lessons: 'GET /api/colors/lessons?grade=pre-k',
        specificLesson: 'GET /api/colors/lessons/:lessonId',
        identify: 'POST /api/colors/identify',
        mix: 'POST /api/colors/mix',
        challenge: 'GET /api/colors/challenge?grade=pre-k'
      },
      
      sentences: {
        activities: 'GET /api/sentences/activities?grade=kindergarten',
        wordOrder: 'POST /api/sentences/word-order',
        fillBlank: 'POST /api/sentences/fill-blank',
        capitalization: 'POST /api/sentences/capitalization',
        capitalizationRules: 'GET /api/sentences/capitalization/rules?grade=kindergarten',
        challenge: 'GET /api/sentences/challenge?grade=kindergarten'
      },
      
      math: {
        problems: 'GET /api/math/problems',
        randomProblem: 'GET /api/math/problem',
        checkAnswer: 'POST /api/math/check'
      }
    },
    
    supportedGrades: ['pre-k', 'kindergarten', '1st', '2nd', '3rd', '4th', '5th'],
    
    learningModules: [
      {
        name: 'Colors',
        description: 'Color identification and mixing for Pre-K and Kindergarten',
        grades: ['pre-k', 'kindergarten']
      },
      {
        name: 'Spelling',
        description: 'Word families and spelling practice for all grades',
        grades: ['pre-k', 'kindergarten', '1st', '2nd', '3rd', '4th', '5th']
      },
      {
        name: 'Sentences',
        description: 'Sentence building and word order practice',
        grades: ['kindergarten', '1st', '2nd', '3rd', '4th', '5th']
      },
      {
        name: 'Capitalization',
        description: 'Grammar rules and capitalization practice',
        grades: ['kindergarten', '1st', '2nd', '3rd', '4th', '5th']
      }
    ]
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.url}`,
    suggestion: 'Check the API documentation at the root endpoint (/)',
    availableEndpoints: [
      '/api/health',
      '/api/users/*',
      '/api/spelling/*',
      '/api/colors/*',
      '/api/sentences/*',
      '/api/math/*'
    ]
  });
});

async function startServer() {
  try {
    const connected = await testConnection();
    if (!connected) {
      console.error('Failed to connect to database. Please check your MySQL configuration.');
      process.exit(1);
    }

    await initializeDatabase();
    
    await seedDatabase();

    //starting the server
    app.listen(port, () => {
      console.log(`Kids Learning Platform API Server listening at http://localhost:${port}`);
      console.log(`Supporting Pre-K through 5th grade learning modules`);
      console.log(`Features: Spelling, Colors, Sentences, Capitalization, Progress Tracking`);
      console.log(`Database: MySQL connected and ready!`);
      console.log(`API Documentation available at: http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error.message);
    process.exit(1);
  }
}

startServer();
