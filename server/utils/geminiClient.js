import axios from 'axios';

export const generateText = async (prompt) => {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("Gemini API key is not configured.");
    return `Gemini API key is not configured. Fallback response for prompt: ${prompt.slice(0, 100)}...`;
  }

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      console.warn("Gemini API returned an empty or unexpected response structure:", response.data);
      return 'No response from Gemini.';
    }
    return text;
  } catch (error) {
    console.error("Gemini API request failed:", error.response?.data || error.message);
    throw new Error(`Gemini API request failed: ${error.message}`);
  }
};
