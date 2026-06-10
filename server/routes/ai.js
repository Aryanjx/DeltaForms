import express from 'express';
import { GoogleGenAI } from '@google/genai'; 
import { Form } from '../models/Form.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { checkPremiumLimits } from '../middleware/premiumGate.js';

const router = express.Router();

const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }
  return new GoogleGenAI({ apiKey });
};

router.post('/generate-layout', requireAuth, checkPremiumLimits, async (req, res) => {
  const ai = getAIClient();
  const { prompt } = req.body;

  console.log('DEBUG AI ROUTE CALLED', { userId: req.user?._id, prompt: prompt ? 'present' : 'missing' });

  if (!prompt) {
    return res.status(400).json({ message: 'A prompt description is required.' });
  }

  const systemInstruction = `
    You are a professional form builder API. Your job is to generate a form layout based on the user's request.
    You MUST respond with a raw JSON object ONLY. Do not include markdown formatting like \`\`\`json or explanations.
    
    The JSON structure must exactly look like this:
    {
      "formTitle": "Name of the form",
      "fields": [
        {
          "id": "unique_field_string_id",
          "label": "Human readable field label",
          "type": "text" | "number" | "email" | "select" | "textarea" | "checkbox",
          "placeholder": "Optional placeholder text",
          "required": true | false,
          "options": ["Only use if type is select", "Option 2"]
        }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a form layout for: ${prompt}`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: 'application/json' 
      }
    });

    // Normalize the response format for both string and object payloads
    const rawPrimary = response.text ?? response.candidates?.[0]?.content?.parts?.[0]?.text;
    const jsonString = typeof rawPrimary === 'string' ? rawPrimary : JSON.stringify(rawPrimary || '');
    if (!jsonString.trim()) throw new Error("Empty text returned from primary model");

    const parsedLayout = JSON.parse(jsonString.trim());
    const formTitle = parsedLayout.formTitle || parsedLayout.title || 'Untitled Form';
    const fields = Array.isArray(parsedLayout.fields) ? parsedLayout.fields : [];

    if (!fields.length) {
      throw new Error('AI response did not include a valid fields array.');
    }

    const newForm = new Form({
      userId: req.user._id,
      formTitle,
      fields
    });
    await newForm.save();

    return res.status(201).json(newForm);

  } catch (error) {
    const primaryErrorMessage = error?.message || JSON.stringify(error);
    console.error('DEBUG PRIMARY ERROR', error);
    const isAccessDenied = error?.status === 403 || error?.code === 403 || /denied/i.test(primaryErrorMessage);
    console.warn("⚠️ Primary generation model failed:", primaryErrorMessage);

    if (isAccessDenied) {
      console.error("❌ Gemini permission denied:", error);
      return res.status(502).json({
        message: 'AI service access denied. Check your Gemini API key and project permissions.'
      });
    }

    try {
      const failoverResponse = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: `Generate a form layout for: ${prompt}`,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: 'application/json'
        }
      });

      // Normalize the failover response format also
      const rawFailover = failoverResponse.text ?? failoverResponse.candidates?.[0]?.content?.parts?.[0]?.text;
      const failoverJsonString = typeof rawFailover === 'string' ? rawFailover : JSON.stringify(rawFailover || '');
      if (!failoverJsonString.trim()) throw new Error("Empty text returned from failover model");

      const parsedLayout = JSON.parse(failoverJsonString.trim());
      const formTitle = parsedLayout.formTitle || parsedLayout.title || 'Untitled Form';
      const fields = Array.isArray(parsedLayout.fields) ? parsedLayout.fields : [];

      if (!fields.length) {
        throw new Error('Failover response did not include a valid fields array.');
      }

      const newForm = new Form({
        userId: req.user._id,
        formTitle,
        fields
      });
      await newForm.save();

      return res.status(201).json(newForm);

    } catch (failoverError) {
      const failoverErrorMessage = failoverError?.message || JSON.stringify(failoverError);
      console.error('DEBUG FAILOVER ERROR', failoverError);
      console.error("❌ Dual-Model Exhaustion Failure:", failoverErrorMessage);

      if (failoverError?.status === 403 || failoverError?.code === 403 || /denied/i.test(failoverErrorMessage)) {
        return res.status(502).json({
          message: 'AI service access denied. Check your Gemini API key and project permissions.'
        });
      }

      return res.status(500).json({
        message: 'AI Engine failed to fulfill form request.',
        error: failoverErrorMessage
      });
    }
  }
});

export default router;