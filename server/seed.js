const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Create database connection
const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DATABASE,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

async function seedDatabase() {
  try {
    console.log('Starting database seeding...\n');
    
    // Read the seed data file
    const seedPath = path.join(__dirname, '../database/seed_data.sql');
    const seedSQL = fs.readFileSync(seedPath, 'utf8');
    
    // Execute the seed data
    await pool.query(seedSQL);
    
    console.log('Sample data inserted successfully!');
    console.log('\nSample data includes:');
    console.log('- 3 test users');
    console.log('- 3 quizzes (Math, History, Science)');
    console.log('- 9 questions total');
    
  } catch (error) {
    console.error('Seeding failed:', error.message);
  } finally {
    await pool.end();
  }
}

seedDatabase(); 