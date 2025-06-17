const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables (now in same directory)
require('dotenv').config();

console.log(process.env.POSTGRES_HOST);
console.log(process.env.POSTGRES_PORT);
console.log(process.env.POSTGRES_DATABASE);
console.log(process.env.POSTGRES_USER);
console.log(process.env.POSTGRES_PASSWORD);

// Create database connection
const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DATABASE,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

// Function to run a single migration file
async function runMigration(filename) {
  try {
    console.log(`Running migration: ${filename}`);
    
    // Read the SQL file (updated path)
    const sqlPath = path.join(__dirname, '../database/migrations', filename);
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Execute the SQL
    await pool.query(sql);
    
    console.log(`Migration ${filename} completed successfully`);
  } catch (error) {
    console.error(`Migration ${filename} failed:`, error.message);
    throw error;
  }
}

// Main function to run all migrations
async function runAllMigrations() {
  try {
    console.log('Starting database migrations...\n');
    
    // Get all migration files and sort them (updated path)
    const migrationFiles = fs.readdirSync(path.join(__dirname, '../database/migrations'))
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    // Run each migration in order
    for (const file of migrationFiles) {
      await runMigration(file);
    }
    
    console.log('\nAll migrations completed successfully!');
    
  } catch (error) {
    console.error('\nMigration failed:', error.message);
    process.exit(1);
  } finally {
    // Close database connection
    await pool.end();
  }
}

// Run the migrations
runAllMigrations(); 