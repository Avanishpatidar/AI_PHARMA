const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const SavedContent = require('../models/SavedContent');
const router = express.Router();

require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Simple rate limiter
let lastRequestTime = 0;
const RATE_LIMIT_INTERVAL = 1000; // 1 request per second

const generateContent = async (medicineName) => {
  const prompt = `
    Please provide detailed information about the medicine "${medicineName}" in the following categories. Each section should start with the section name followed by a colon (:), and then the content. If information is not available, please mention "Not available".

    1. Composition: Describe the active ingredients.
    2. Purpose: Explain what it is used for.
    3. Ayurvedic Solution: Suggest Ayurvedic alternatives.
    4. Homeopathy Solution: Suggest Homeopathic alternatives.
    5. Natural Ways to Heal: Recommend natural remedies.
    6. Exercises: Suggest exercises that might help.
    7. Food to Take: Recommend foods to take while using this medicine.
    8. History: Provide a brief history of this medicine.
    9. Mechanism: Explain how it works.
    10. Dosage: Suggest the typical dosage.
    11. Benefits: List the benefits.
    12. Side Effects: List possible side effects.
    13. Other Options: Suggest other medication options.
    14. Estimated Price in INR: Provide an estimated price in INR.
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
};

const rateLimiter = (req, res, next) => {
  const now = Date.now();
  if (now - lastRequestTime < RATE_LIMIT_INTERVAL) {
    return res.status(429).json({ error: 'Too Many Requests, please try again later.' });
  }
  lastRequestTime = now;
  next();
};

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Access denied' });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

router.get('/generate', rateLimiter, async (req, res) => {
  const { medicineName } = req.query;
  if (!medicineName) {
    return res.status(400).json({ error: 'medicineName query parameter is required' });
  }
  try {
    const content = await generateContent(medicineName);
    res.json({ content });
  } catch (error) {
    res.status(500).json({ error: 'Error generating content' });
  }
});

router.post('/generate', rateLimiter, authenticateToken, async (req, res) => {
  const { medicineName } = req.body;
  if (!medicineName) {
    return res.status(400).json({ error: 'medicineName is required' });
  }
  try {
    const content = await generateContent(medicineName);
    const savedContent = new SavedContent({ userId: req.user.id, medicineName, content });
    await savedContent.save();
    res.json({ content });
  } catch (error) {
    res.status(500).json({ error: 'Error generating content' });
  }
});

module.exports = router;
