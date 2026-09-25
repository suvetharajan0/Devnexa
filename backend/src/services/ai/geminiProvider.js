import { geminiModel, MODEL_NAME } from '../../config/gemini.js';
import { ApiError } from '../../utils/ApiError.js';


const SYSTEM_PROMPT = `You are Code Mentor AI, a patient senior developer helping another
developer understand and improve their code. Explain concepts in plain English.
When suggesting improvements, explain WHY, not just what to change. Keep responses
focused and skimmable — use short paragraphs or bullet points, not a wall of text.`;


export async function generateCodeMentorResponse({ code, language, question }) {
  const userPrompt = [
    language ? `Language: ${language}` : null,
    `Code:\n\`\`\`\n${code}\n\`\`\``,
    question ? `Question: ${question}` : 'Please explain this code and suggest any improvements.',
  ]
    .filter(Boolean)
    .join('\n\n');


  try {
    const response = await geminiModel.models.generateContent({
      model: MODEL_NAME,
      contents: `${SYSTEM_PROMPT}\n\n${userPrompt}`,
    });


    return response.text;
  } catch (error) {
    console.error('[devnexa] Gemini request failed:', error.message);
    throw ApiError.internal('Code Mentor AI is temporarily unavailable. Please try again.');
  }
}


