import { generateCodeMentorResponse } from './geminiProvider.js';


// A thin service layer between the controller and the provider — the
// natural place to add things later (saving mentor sessions, per-user
// limits) without the controller needing to know or care.
export async function askCodeMentor({ code, language, question }) {
  const answer = await generateCodeMentorResponse({ code, language, question });
  return { answer };
}
