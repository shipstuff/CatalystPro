const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { verifyToken } = require('../middleware/auth');

router.get('/test', async (req, res) => {
    res.json({
        success: true,
        message: 'Experience endpoint working'
    });
});



router.post('/award', verifyToken, async (req, res) => {
    try {
        const userID = req.user.userId;
        const { amount } = req.body;
                
        // Update user experience
        const updatedUser = await pool.query('UPDATE users SET experience = experience + $1 WHERE id = $2 RETURNING *', [amount, userID]);

        res.json({
            success: true,
            user: updatedUser.rows[0]
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to award experience' });
    }
});


module.exports = router;