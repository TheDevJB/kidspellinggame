const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  console.log('🔍 Testing MySQL connection...\n');
  
  const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: process.env.DB_PORT || 3306
  };

  console.log('Connection config:');
  console.log(`Host: ${config.host}`);
  console.log(`User: ${config.user}`);
  console.log(`Port: ${config.port}`);
  console.log(`Password: ${config.password ? '***' : '(empty)'}\n`);

  try {
    // Test basic connection
    const connection = await mysql.createConnection(config);
    console.log('✅ Successfully connected to MySQL server!');
    
    // Test database access
    const dbName = process.env.DB_NAME || 'kids_spelling_game';
    try {
      await connection.execute(`USE ${dbName}`);
      console.log(`✅ Successfully accessed database: ${dbName}`);
      
      // Test table access
      const [tables] = await connection.execute('SHOW TABLES');
      console.log(`✅ Found ${tables.length} tables in database`);
      
      if (tables.length > 0) {
        console.log('Tables:');
        tables.forEach(table => {
          console.log(`  - ${Object.values(table)[0]}`);
        });
      }
      
    } catch (dbError) {
      console.log(`⚠️  Database '${dbName}' not found or not accessible`);
      console.log('💡 Run "npm run setup" to create the database and tables');
    }
    
    await connection.end();
    console.log('\n🎉 Connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Make sure MySQL is running');
    console.log('2. Check your .env file credentials');
    console.log('3. Verify the user has proper permissions');
    console.log('4. Check if the port is correct (usually 3306)');
  }
}

testConnection(); 