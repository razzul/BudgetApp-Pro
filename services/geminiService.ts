
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getFinancialInsight = async (summary: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Given this financial summary: "${summary}", provide 3 brief, actionable pieces of advice to improve savings or optimize spending. Keep it encouraging and concise.`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 250
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Keep up the good work! Try to allocate 10% more to your Emergency Fund this month.";
  }
};
