const express = require('express');
const { pool } = require('../config/database');
const router = express.Router();

// GET /api/quizzes - Get all quizzes
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM quizzes');

        res.json({
            success: true,
            quizzes: result.rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching quizzes',
            error: error.message
        });
    }
});

router.get('/:id/questions', async (req, res) => {
    try {
      const quizId = req.params.id;
      const result = await pool.query(
        'SELECT * FROM questions WHERE quiz_id = $1 ORDER BY question_order',
        [quizId]
      );
      
      res.json({
        success: true,
        data: result.rows
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch questions'
      });
    }
  });

module.exports = router; 