require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { pool } = require('./config/database');
const quizzesRouter = require('./routes/quizzes');
const authRouter = require('./routes/auth');
const experienceRouter = require('./routes/experience');
const userRouter = require('./routes/user');
const aiRouter = require('./routes/ai');

const app = express();

const PORT = process.env.PORT || 5000;

app.use(helmet()); 
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/quizzes', quizzesRouter);
app.use('/api/auth', authRouter);
app.use('/api/experience', experienceRouter);
app.use('/api/user', userRouter);
app.use('/api/ai', aiRouter);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend Running',
    timestamp: new Date().toISOString()
  });
});


app.get('/api/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as current_time');
    res.json({
      status: 'OK',
      message: 'Database connected successfully!',
      database_time: result.rows[0].current_time
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Database connection failed',
      error: error.message
    });
  }
});

app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Database test: http://localhost:${PORT}/api/db-test`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
}); 