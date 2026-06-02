import express from 'express';
import fetch from 'node-fetch'; 
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate-layout', requireAuth, async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'A prompt description is required.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("CRITICAL: GEMINI_API_KEY is blank or missing in your .env file!");
      return res.status(500).json({ message: 'Server missing API configuration.' });
    }

    const systemContext = `
      You are a specialized UI/UX JSON form architectural layout generator. 
      Analyze the user prompt and generate a clean, modern form layout structure.
      You must respond with ONLY a valid raw JSON object. Do not include markdown wraps like \`\`\`json.
      
      The structure must strictly follow this shape:
      {
        "formTitle": "Clear title for the form",
        "fields": [
          {
            "id": "lowercase_snake_case_id",
            "label": "User friendly field label",
            "type": "text", 
            "placeholder": "Helpful sample value text",
            "required": true
          }
        ]
      }
      Supported field types are only: 'text', 'number', 'email', 'select', 'textarea', 'checkbox'.
      If type is 'select', include an array property called "options": ["Opt 1", "Opt 2"]. Otherwise omit it.
    `;

    // 🔄 Array of Google endpoints to iterate through in case of traffic spikes
   // 🔄 Swapped out legacy 1.5 for the robust 2.5-pro model endpoint
    const endpoints = [
      'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent',
      'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent'
    ];

    let apiResponse;
    let data;
    let fallbackTriggered = false;

    // Iterate through the available model options
    for (let i = 0; i < endpoints.length; i++) {
      const currentEndpoint = endpoints[i];
      const modelName = currentEndpoint.split('/models/')[1].split(':')[0];
      
      console.log(`Sending request to Google Gemini API (${modelName})...`);

      try {
        apiResponse = await fetch(currentEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey.trim()
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: `${systemContext}\n\nUser Prompt: ${prompt}` }
                ]
              }
            ]
          })
        });

        data = await apiResponse.json();

        // Check if primary model is overloaded (503 Service Unavailable)
        if (apiResponse.status === 503 && i < endpoints.length - 1) {
          console.warn(`⚠️ Model ${modelName} is experiencing high demand. Dropping to fallback...`);
          fallbackTriggered = true;
          continue; // Skips remaining block execution, proceeds to next array item loop
        }

        // Break the loop if the response is otherwise evaluated (success or regular failure status)
        break;
      } catch (fetchError) {
        if (i === endpoints.length - 1) throw fetchError;
        console.warn(`⚠️ Connection to ${modelName} dropped. Moving to fallback...`);
      }
    }

    // Standard structural error evaluation
    if (!apiResponse.ok) {
      console.error("Google Server Error Payload:", JSON.stringify(data, null, 2));
      throw new Error(data.error?.message || 'Google API standard response error');
    }
    
    let textResponse = data.candidates[0].content.parts[0].text.trim();

    // Secondary safety cleanup for markdown tags
    if (textResponse.includes('```')) {
      textResponse = textResponse.replace(/```json|```/g, '').trim();
    }

    const cleanedJson = JSON.parse(textResponse);
    console.log("Successfully generated form schema structure!");
    res.status(200).json(cleanedJson);

  } catch (error) {
    console.error('Core AI Router Failure Detail:', error.message);
    res.status(500).json({ message: 'AI Engine failed to parse prompt.', error: error.message });
  }
});

export default router;