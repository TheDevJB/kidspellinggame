const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/spelling', require('./routes/spelling'));
app.use('/api/math', require('./routes/math'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running!' });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Kids Spelling Game API',
    endpoints: {
      health: '/api/health',
      spelling: {
        all: '/api/spelling/words',
        random: '/api/spelling/word',
        check: '/api/spelling/check'
      },
      math: {
        all: '/api/math/problems',
        random: '/api/math/problem',
        check: '/api/math/check'
      }
    }
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.url}`
  });
});

app.listen(port, () => {
  console.log(`API Server listening at http://localhost:${port}`);
});