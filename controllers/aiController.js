const openai = require('openai');

// Use environment variable for API key
openai.apiKey = process.env.OPENAI_API_KEY;

async function fetchAIRecommendations(prompt) {
  try {
    const response = await openai.Completion.create({
      engine: 'davinci-codex',
      prompt: prompt,
      max_tokens: 50,
      n: 1,
      stop: null,
      temperature: 0.7,
    });

    return response.choices[0].text.trim(); // Trim to remove any leading/trailing whitespace
  } catch (error) {
    console.error('Error fetching AI recommendations:', error);
    throw new Error('Failed to fetch AI recommendations'); // Throw a generic error to the caller
  }
}

module.exports = {
  fetchAIRecommendations,
};
