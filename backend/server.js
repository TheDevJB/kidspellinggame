// Import required modules (libraries) that we need for our server
const express = require('express'); // Express.js - web framework for Node.js that makes building APIs easier
const app = express(); // Create an Express application instance - this is our main server object
const cors = require('cors'); // CORS (Cross-Origin Resource Sharing) - allows our Angular app to talk to this API
const port = 3000; // Define which port our server will listen on (like a door number for internet traffic)

// MIDDLEWARE SECTION
// Middleware are functions that run BEFORE your route handlers
// Think of them as security guards or processors that check/modify requests

app.use(cors()); // Enable CORS for all routes - allows requests from different domains (like your Angular app)
app.use(express.json()); // Parse JSON data from request bodies - converts JSON strings to JavaScript objects

// API ROUTES SECTION
// Routes define what happens when someone visits different URLs on your server
// Each route connects a URL path to specific functionality

// LEARNING MODULE ROUTES
app.use('/api/spelling', require('./routes/spelling')); // Enhanced spelling routes with grade levels and word families
app.use('/api/colors', require('./routes/colors')); // Color learning routes for Pre-K and Kindergarten
app.use('/api/sentences', require('./routes/sentences')); // Sentence building and capitalization routes
app.use('/api/math', require('./routes/math')); // Math routes (existing functionality)

// USER MANAGEMENT ROUTES
app.use('/api/users', require('./routes/users')); // User registration, authentication, and progress tracking

// INDIVIDUAL ROUTE DEFINITIONS
// These are specific endpoints that respond to HTTP requests

// Health check route - used to verify if the server is working
// GET request to /api/health returns server status
app.get('/api/health', (req, res) => {
  // req = request object (contains info about the incoming request)
  // res = response object (used to send data back to the client)
  res.json({ 
    status: 'OK', 
    message: 'Kids Learning Platform API is running!',
    version: '2.0.0',
    features: ['spelling', 'colors', 'sentences', 'capitalization', 'user-management']
  }); // Send JSON response
});

// Root route - the main page of your API
// GET request to / (root URL) returns comprehensive API documentation
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Kids Learning Platform API - Pre-K through 5th Grade',
    version: '2.0.0',
    description: 'Comprehensive educational API supporting multiple learning modules with progress tracking',
    endpoints: { // List all available API endpoints for developers
      health: '/api/health',
      
      // USER MANAGEMENT ENDPOINTS
      users: {
        register: 'POST /api/users/register',
        login: 'POST /api/users/login',
        profile: 'GET /api/users/:userId/profile',
        updateAvatar: 'PUT /api/users/:userId/avatar',
        updateProgress: 'POST /api/users/progress',
        leaderboard: 'GET /api/users/leaderboard'
      },
      
      // SPELLING ENDPOINTS (Enhanced)
      spelling: {
        words: 'GET /api/spelling/words?grade=pre-k&family=at',
        randomWord: 'GET /api/spelling/word?grade=pre-k',
        wordFamilies: 'GET /api/spelling/families?grade=pre-k',
        checkSpelling: 'POST /api/spelling/check',
        userProgress: 'GET /api/spelling/progress/:userId',
        addWord: 'POST /api/spelling/add'
      },
      
      // COLOR LEARNING ENDPOINTS (New)
      colors: {
        lessons: 'GET /api/colors/lessons?grade=pre-k',
        specificLesson: 'GET /api/colors/lessons/:lessonId',
        identify: 'POST /api/colors/identify',
        mix: 'POST /api/colors/mix',
        challenge: 'GET /api/colors/challenge?grade=pre-k'
      },
      
      // SENTENCE BUILDING ENDPOINTS (New)
      sentences: {
        activities: 'GET /api/sentences/activities?grade=kindergarten',
        wordOrder: 'POST /api/sentences/word-order',
        fillBlank: 'POST /api/sentences/fill-blank',
        capitalization: 'POST /api/sentences/capitalization',
        capitalizationRules: 'GET /api/sentences/capitalization/rules?grade=kindergarten',
        challenge: 'GET /api/sentences/challenge?grade=kindergarten'
      },
      
      // MATH ENDPOINTS (Existing)
      math: {
        problems: 'GET /api/math/problems',
        randomProblem: 'GET /api/math/problem',
        checkAnswer: 'POST /api/math/check'
      }
    },
    
    // SUPPORTED GRADE LEVELS
    supportedGrades: ['pre-k', 'kindergarten', '1st', '2nd', '3rd', '4th', '5th'],
    
    // LEARNING MODULES
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

// ERROR HANDLING
// 404 handler for undefined routes - catches requests to URLs that don't exist
app.use((req, res) => {
  res.status(404).json({ // Set HTTP status code to 404 (Not Found)
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.url}`, // Show what method (GET, POST, etc.) and URL was requested
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

// START THE SERVER
// Tell the server to start listening for requests on the specified port
app.listen(port, () => {
  console.log(`🎓 Kids Learning Platform API Server listening at http://localhost:${port}`); // Confirmation message when server starts
  console.log(`📚 Supporting Pre-K through 5th grade learning modules`);
  console.log(`🌟 Features: Spelling, Colors, Sentences, Capitalization, Progress Tracking`);
  console.log(`📖 API Documentation available at: http://localhost:${port}`);
});