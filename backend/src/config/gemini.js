import { GoogleGenAI } from '@google/genai';
import { env } from './env.js';


console.log('[devnexa] Gemini key loaded:', env.GEMINI_API_KEY ? 'yes' : 'no — undefined');


export const geminiModel = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
export const MODEL_NAME = 'gemini-3-flash-preview';
