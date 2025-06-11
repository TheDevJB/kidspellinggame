const { Pool } = require('pg');
require('dotenv').config();

// Database configuration for production scale
const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'kids_spelling_game',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
  
  // Connection pool settings for high concurrency
  max: 20, // Maximum number of clients in the pool
  min: 5,  // Minimum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
  maxUses: 7500, // Close (and replace) a connection after it has been used 7500 times
  
  // SSL configuration for production
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false
};

// Create connection pool
const pool = new Pool(dbConfig);

// Handle pool errors
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Database initialization SQL
const initSQL = `
  -- Enable UUID extension
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  
  -- Create users table for multi-user support
  CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255),
    display_name VARCHAR(100),
    grade_level INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true
  );

  -- Create word_families table
  CREATE TABLE IF NOT EXISTS word_families (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    pattern VARCHAR(50) NOT NULL,
    difficulty VARCHAR(10) CHECK(difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'easy',
    grade_level INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );

  -- Create words table
  CREATE TABLE IF NOT EXISTS words (
    id SERIAL PRIMARY KEY,
    word VARCHAR(50) NOT NULL,
    family_id INTEGER NOT NULL REFERENCES word_families(id) ON DELETE CASCADE,
    example_sentence TEXT NOT NULL,
    phonetic_spelling VARCHAR(100),
    difficulty_score INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(word, family_id)
  );

  -- Create user_progress table for tracking individual progress
  CREATE TABLE IF NOT EXISTS user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    word_id INTEGER NOT NULL REFERENCES words(id) ON DELETE CASCADE,
    family_id INTEGER NOT NULL REFERENCES word_families(id) ON DELETE CASCADE,
    mastered BOOLEAN DEFAULT FALSE,
    attempts INTEGER DEFAULT 0,
    correct_attempts INTEGER DEFAULT 0,
    first_correct_at TIMESTAMP WITH TIME ZONE,
    last_attempt_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    streak_count INTEGER DEFAULT 0,
    UNIQUE(user_id, word_id)
  );

  -- Create family_progress table for family completion tracking
  CREATE TABLE IF NOT EXISTS family_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    family_id INTEGER NOT NULL REFERENCES word_families(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    in_progress BOOLEAN DEFAULT FALSE,
    words_learned INTEGER DEFAULT 0,
    total_words INTEGER DEFAULT 0,
    completion_percentage DECIMAL(5,2) DEFAULT 0.00,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, family_id)
  );

  -- Create sessions table for user session management
  CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_start TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    session_end TIMESTAMP WITH TIME ZONE,
    words_practiced INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    total_attempts INTEGER DEFAULT 0,
    session_duration_minutes INTEGER DEFAULT 0
  );

  -- Create indexes for performance
  CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
  CREATE INDEX IF NOT EXISTS idx_user_progress_family_id ON user_progress(family_id);
  CREATE INDEX IF NOT EXISTS idx_user_progress_mastered ON user_progress(mastered);
  CREATE INDEX IF NOT EXISTS idx_family_progress_user_id ON family_progress(user_id);
  CREATE INDEX IF NOT EXISTS idx_family_progress_completed ON family_progress(completed);
  CREATE INDEX IF NOT EXISTS idx_words_family_id ON words(family_id);
  CREATE INDEX IF NOT EXISTS idx_words_active ON words(is_active);
  CREATE INDEX IF NOT EXISTS idx_word_families_difficulty ON word_families(difficulty);
  CREATE INDEX IF NOT EXISTS idx_word_families_grade ON word_families(grade_level);
  CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
  CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
  CREATE INDEX IF NOT EXISTS idx_user_sessions_date ON user_sessions(session_start);

  -- Create updated_at trigger function
  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
  END;
  $$ language 'plpgsql';

  -- Create triggers for updated_at
  DROP TRIGGER IF EXISTS update_users_updated_at ON users;
  CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

  DROP TRIGGER IF EXISTS update_word_families_updated_at ON word_families;
  CREATE TRIGGER update_word_families_updated_at 
    BEFORE UPDATE ON word_families 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`;

// Initialize database
const initDatabase = async () => {
  const client = await pool.connect();
  try {
    await client.query(initSQL);
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Helper function to execute queries
const query = async (text, params = []) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    
    // Log slow queries (> 100ms)
    if (duration > 100) {
      console.warn(`Slow query detected (${duration}ms):`, text.substring(0, 100));
    }
    
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Helper function for transactions
const transaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Health check function
const healthCheck = async () => {
  try {
    const result = await query('SELECT NOW() as current_time, version() as pg_version');
    return {
      status: 'healthy',
      timestamp: result.rows[0].current_time,
      database: 'PostgreSQL',
      version: result.rows[0].pg_version.split(' ')[1],
      pool: {
        total: pool.totalCount,
        idle: pool.idleCount,
        waiting: pool.waitingCount
      }
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message
    };
  }
};

// Graceful shutdown
const closePool = async () => {
  try {
    await pool.end();
    console.log('Database pool closed');
  } catch (error) {
    console.error('Error closing database pool:', error);
  }
};

module.exports = {
  pool,
  query,
  transaction,
  initDatabase,
  healthCheck,
  closePool
}; 