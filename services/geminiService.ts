import { GoogleGenAI } from "@google/genai";
import { Message } from "../types";

const KNOWLEDGE_STORE_ID = "SG-RAG; gen-lang-client-0621477167";

const FALLBACK_PHRASE = "We haven't written about that yet, but our lawyers will know. Book a call with them here:";

const SYSTEM_INSTRUCTION = `
You are the Official SG Investment Intelligence AI.
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
  
  // 1. LOG USER INPUT (Trigger log immediately)
  // If userInput is empty (audio only), we log "[Audio Message]"
  const userLogText = userInput || "[Audio Message]";
  await logToN8n("user", userLogText);

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

    // Calculate the final text (or use fallback if empty)
    const text = response.text?.trim() || FALLBACK_PHRASE;
    
    // 2. LOG SUCCESSFUL RESPONSE
    await logToN8n("model", text);

    return text;

  } catch (error) {
    console.error("Gemini API Error:", error);
    
    // 3. LOG ERROR RESPONSE
    // If it fails, we still want to log that the user got the fallback message
    await logToN8n("model", FALLBACK_PHRASE);
    
    return FALLBACK_PHRASE;
  }
};

// --- HELPER FUNCTION: SENDS LOGS TO N8N ---
// This sits outside the main function so it is clean and reusable
async function logToN8n(role: string, text: string) {
  try {
    // Your specific n8n URL
    const webhookUrl = "https://honest-ink.app.n8n.cloud/webhook/SG_chat_log"; 
    
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        role: role, 
        text: text, 
        date: new Date().toISOString() 
      })
    });
  } catch (error) {
    // We log the error to the console, but we do NOT stop the app.
    console.error("Logging to n8n failed", error);
  }
}