
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Simple in-memory cache to prevent quota exhaustion on navigation
const insightCache = new Map<string, string>();

/**
 * Executes an asynchronous function with exponential backoff retries.
 * Specifically targets 429 (Rate Limit) and Resource Exhausted errors.
 */
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3, baseDelay = 1500): Promise<T> {
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (error: any) {
      const errorMsg = error?.message || "";
      const errorStatus = error?.status || error?.code;
      const isRateLimit = 
        errorStatus === 429 || 
        errorMsg.includes("429") || 
        errorMsg.includes("RESOURCE_EXHAUSTED") ||
        errorMsg.includes("quota");

      if (isRateLimit && attempt < maxRetries - 1) {
        attempt++;
        const delay = baseDelay * Math.pow(2, attempt - 1);
        console.warn(`Gemini API Quota reached. Retrying in ${delay}ms... (Attempt ${attempt}/${maxRetries})`);
        await sleep(delay);
        continue;
      }
      throw error;
    }
  }
  throw new Error("Maximum retry attempts reached.");
}

export const getFinancialInsight = async (summary: string) => {
  // 1. Check Cache First (Zero Quota Usage)
  if (insightCache.has(summary)) {
    return insightCache.get(summary);
  }

  try {
    const response = await withRetry(() => ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Given this financial summary: "${summary}", provide 3 brief, actionable pieces of advice to improve savings or optimize spending. Keep it encouraging and concise. Format as a single paragraph.`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 250
      }
    }));
    
    const text = response.text || "";
    // 2. Cache successful response
    if (text) insightCache.set(summary, text);
    return text;

  } catch (error) {
    console.warn("Gemini Service: Quota exhausted or error occurred. Using fallback logic.");
    
    // Professional fallback message
    const fallback = "Our AI analyst is currently processing a high volume of requests. General strategy for this month: 1. Audit recurring subscriptions for unused services, 2. Aim to divert 5% more of your surplus into your Emergency Fund, and 3. Review your discretionary 'Dining' category to identify easy savings.";
    
    // 3. Cache fallback to prevent repeated failing calls for the same summary
    insightCache.set(summary, fallback);
    return fallback;
  }
};
