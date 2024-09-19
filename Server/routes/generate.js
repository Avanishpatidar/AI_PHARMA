const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const SavedContent = require('../models/SavedContent');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');

require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

let lastRequestTime = 0;
const RATE_LIMIT_INTERVAL = 1000;

const generateMedicineInfo = async (medicineName) => {
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

const generateHealthAnswer = async (question) => {
  const prompt = `
    As a knowledgeable health assistant, please provide a clear and concise answer to the following health-related question. If the question is about a specific condition, include information about symptoms, causes, and general treatment approaches. If it's about healthy living, provide practical advice and scientific reasoning where applicable. Always encourage consulting with a healthcare professional for personalized medical advice.

    Question: ${question}
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

router.post('/', rateLimiter, async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    let content;
    if (query.toLowerCase().startsWith('medicine:')) {
      const medicineName = query.slice(9).trim();
      content = await generateMedicineInfo(medicineName);
    } else {
      content = await generateHealthAnswer(query);
    }
    res.json({ content });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Error generating content' });
  }
});

router.post('/save', authenticateToken, async (req, res) => {
  const { query, content } = req.body;
  try {
    const savedContent = new SavedContent({
      userId: req.user.id,
      query,
      content,
    });
    await savedContent.save();
    res.status(201).json({ message: 'Content saved successfully' });
  } catch (error) {
    console.error('Error saving content:', error);
    res.status(500).json({ error: 'Error saving content' });
  }
});

module.exports = router;