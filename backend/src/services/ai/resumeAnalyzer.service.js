import { geminiModel, MODEL_NAME } from '../../config/gemini.js';
import { ApiError } from '../../utils/ApiError.js';


const SYSTEM_PROMPT = `You are an expert technical recruiter and resume reviewer.
Analyze the resume text provided and respond with ONLY valid JSON — no markdown
code fences, no preamble, no explanation outside the JSON. Use exactly this shape:


{
  "atsScore": <number 0-100, how well this resume would pass an Applicant Tracking System>,
  "strengths": [<3-5 short strings, specific to THIS resume, not generic advice>],
  "improvements": [<3-5 short strings, specific and actionable, not generic advice>]
}`;


// Strips accidental markdown code fences (```json ... ```) in case the
// model wraps its JSON output despite being told not to — a common
// real-world quirk of LLM structured output.
function extractJson(text) {
  const cleaned = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
}


export async function generateResumeAnalysis({ resumeText }) {
  try {
    const response = await geminiModel.models.generateContent({
      model: MODEL_NAME,
      contents: `${SYSTEM_PROMPT}\n\nResume:\n${resumeText}`,
    });


    const parsed = extractJson(response.text);


    // Defensive validation — never trust that the model followed
    // instructions perfectly. If the shape is wrong, treat it as a
    // failure rather than passing broken data to the frontend.
    if (
      typeof parsed.atsScore !== 'number' ||
      !Array.isArray(parsed.strengths) ||
      !Array.isArray(parsed.improvements)
    ) {
      throw new Error('Unexpected response shape from AI');
    }


    return parsed;
  } catch (error) {
    console.error('[devnexa] Resume analysis failed:', error.message);
    throw ApiError.internal('Resume Analyzer is temporarily unavailable. Please try again.');
  }
}
