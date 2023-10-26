const express = require('express');
const router = express.Router();
const { fetchAIRecommendations } = require('../controllers/aiController');
const authenticate = require('../middleware/authenticate');

// Input validation middleware (as an example)
function validatePrompt(req, res, next) {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string' || prompt.length > 500) { // Example: limit prompt to 500 characters
    return res.status(400).json({ error: 'Invalid prompt.' });
  }
  next();
}

/**
 * @swagger
 * /api/ai/recommendations:
 *   post:
 *     summary: Fetch AI recommendations
 *     tags:
 *       - AI
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prompt:
 *                 type: string
 *     responses:
 *       200:
 *         description: Returns AI recommendations.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal Server Error.
 */
router.post('/ai/recommendations', authenticate, validatePrompt, async (req, res) => {
  const { prompt } = req.body;

  try {
    const recommendations = await fetchAIRecommendations(prompt);
    res.json({ recommendations });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: 'Failed to fetch AI recommendations.' });
  }
});

module.exports = router;
