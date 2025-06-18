const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { GoogleGenAI } = require('@google/genai');

const genAi = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

router.post('/explain', verifyToken, async (req, res) => {
    try {
        const {questionText, correctAnswer, userAnswer, isCorrect} = req.body;

        console.log('AI Explain Request:', {
            questionText,
            correctAnswer, 
            userAnswer,
            isCorrect
        });
        
        const prompt = isCorrect 
        ? `The user got this quiz question correct: "${questionText}". Their answer was "${correctAnswer}". Please provide additional helpful information about this topic to deepen their understanding. Keep it concise but educational.`
        : `The user got this quiz question wrong: "${questionText}". They answered "${userAnswer}" but the correct answer is "${correctAnswer}". Please explain why the correct answer is right and help them understand the concept. Be encouraging and educational.`;
    
        const response = await genAi.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                thinkingConfig: {
                    thinkingBudget: 0,
                },
            }
        });

        res.json({
            success: true,
            explanation: response.text
        });
        
    } catch (error) {
        console.error('AI explain error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to get AI explanation' 
        });
    }
});

module.exports = router;
