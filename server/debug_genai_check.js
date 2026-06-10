import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();
const apiKey = process.env.GEMINI_API_KEY;
console.log('GEMINI_API_KEY SET:', !!apiKey);
const ai = new GoogleGenAI({ apiKey });

const run = async () => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Generate a simple JSON object for debug.',
      config: { systemInstruction: 'Return JSON only.', responseMimeType: 'application/json' }
    });
    console.log('SUCCESS', response);
  } catch (err) {
    console.error('ERROR TYPE', err?.constructor?.name, 'STATUS', err?.status || err?.code);
    console.error('ERROR MESSAGE', err?.message || err);
    console.error('ERROR RAW', JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
  }
};

run();
