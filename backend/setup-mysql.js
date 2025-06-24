const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
  console.log('Setting up MySQL database for Kids Spelling Game...\n');

  try {
    // First, connect without specifying database to create it
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306
    });

    console.log('Connected to MySQL server');

    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'kids_spelling_game';
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`Database '${dbName}' created or already exists`);

    await connection.end();

    // Now use the database functions to set up tables
    const { testConnection, initializeDatabase, seedDatabase } = require('./config/database');

    console.log('\nSetting up database tables...');
    await initializeDatabase();

    console.log('\nSeeding database with initial data...');
    await seedDatabase();

    console.log('\nDatabase setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Make sure your .env file has the correct database credentials');
    console.log('2. Run: npm install');
    console.log('3. Run: npm run dev');
    console.log('4. Visit: http://localhost:3000/api/health');

  } catch (error) {
    console.error('Error setting up database:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Make sure MySQL is running');
    console.log('2. Check your database credentials in .env file');
    console.log('3. Ensure the MySQL user has permission to create databases');
    process.exit(1);
  }
}

if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase }; 