
import { GoogleGenAI } from "@google/genai";
import { Message } from "../types";

const KNOWLEDGE_STORE_ID = "SG-RAG; gen-lang-client-0621477167";

const FALLBACK_PHRASE = "We haven't written about that yet, but our lawyers will know. Book a call with them here:";

const SYSTEM_INSTRUCTION = `
You are the Official Simpson Grierson Investment Intelligence AI.
Your primary directive is to provide information regarding investment opportunities, requirements, and legal frameworks in New Zealand using ONLY the Gemini File Search Store: ${KNOWLEDGE_STORE_ID}.

STRICT OPERATIONAL CONSTRAINTS:
1. EXCLUSIVE SOURCE: You MUST ONLY retrieve and provide information that is contained within the specified knowledge store.
2. RESPONSE LENGTH: Your answers must be approximately 50 words long. Be concise and high-impact.
3. OUT OF SCOPE: If a user asks a question that cannot be answered using the information in that specific store, you MUST respond with the exact phrase: "${FALLBACK_PHRASE}" and nothing else. No apologies, no explanations, no general advice.
4. NO HALLUCINATION: Do not use your internal general knowledge. If it's not in the store, you don't know it.
5. TONE: Professional, corporate, concise, and accurate.
6. MULTIMODAL: You may receive audio input. Listen carefully to the user's question and provide the answer based on the knowledge store.
`;

export const getGeminiResponse = async (
  history: Message[], 
  userInput: string, 
  audioData?: { data: string; mimeType: string }
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    
    const parts: any[] = [];
    if (audioData) {
      parts.push({
        inlineData: {
          data: audioData.data,
          mimeType: audioData.mimeType,
        },
      });
    }
    if (userInput) {
      parts.push({ text: userInput });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [
        ...history.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
        { role: 'user', parts: parts }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0,
        topP: 0.95,
        thinkingConfig: { thinkingBudget: 2000 }
      },
    });

    const text = response.text?.trim();
    return text || FALLBACK_PHRASE;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return FALLBACK_PHRASE;
  }
};
