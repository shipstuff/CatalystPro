const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { verifyToken } = require('../middleware/auth');

router.get('/profile', verifyToken, async (req, res) => {
    try {
        const userID = req.user.userId;

        const user = await pool.query('SELECT * FROM users WHERE id = $1', [userID]);
        if (user.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            success: true,
            user: user.rows[0]
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

module.exports = router;