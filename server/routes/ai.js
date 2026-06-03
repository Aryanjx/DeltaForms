import express from 'express';
import { GoogleGenAI } from '@google/genai'; 
import { Form } from '../models/Form.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { checkPremiumLimits } from '../middleware/premiumGate.js';

const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post('/generate-layout', requireAuth, checkPremiumLimits, async (req, res) => {
  const { prompt } = req.body;

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

    // ✅ FIXED FOR MODERN @google/genai SDK: Use text property safely
    const jsonString = response.text || response.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!jsonString) throw new Error("Empty text returned from primary model");

    const parsedLayout = JSON.parse(jsonString.trim());

    const newForm = new Form({
      userId: req.user._id,
      formTitle: parsedLayout.formTitle,
      fields: parsedLayout.fields
    });
    await newForm.save();

    return res.status(201).json(newForm);

  } catch (error) {
    console.warn("⚠️ Primary generation model throttled or failed. Engaging failover routing...", error.message);
    
    try {
      const failoverResponse = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: `Generate a form layout for: ${prompt}`,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: 'application/json'
        }
      });

      // ✅ FIXED FOR MODERN @google/genai SDK: Use text property safely
      const failoverJsonString = failoverResponse.text || failoverResponse.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!failoverJsonString) throw new Error("Empty text returned from failover model");

      const parsedLayout = JSON.parse(failoverJsonString.trim());
      
      const newForm = new Form({
        userId: req.user._id,
        formTitle: parsedLayout.formTitle,
        fields: parsedLayout.fields
      });
      await newForm.save();

      return res.status(201).json(newForm);

    } catch (failoverError) {
      console.error("❌ Dual-Model Exhaustion Failure:", failoverError);
      return res.status(500).json({ message: 'AI Engine failed to fulfill form request.' });
    }
  }
});

export default router;