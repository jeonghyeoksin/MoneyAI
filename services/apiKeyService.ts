import { GoogleGenAI } from "@google/genai";

const STORAGE_KEY = 'gemini_api_key';

export enum ApiKeyStatus {
  MISSING = 'MISSING',
  VALIDATING = 'VALIDATING',
  VALID = 'VALID',
  INVALID = 'INVALID',
}

export const getStoredApiKey = (): string | null => {
  return localStorage.getItem(STORAGE_KEY);
};

export const setStoredApiKey = (key: string) => {
  localStorage.setItem(STORAGE_KEY, key);
};

export const removeStoredApiKey = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const validateApiKey = async (key: string): Promise<boolean> => {
  if (!key) return false;
  try {
    const ai = new GoogleGenAI({ apiKey: key });
    // Simple call to check if key works
    await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: 'hi',
      config: { maxOutputTokens: 1 }
    });
    return true;
  } catch (error) {
    console.error('API Key validation failed:', error);
    return false;
  }
};

export const getActiveApiKey = (): string | undefined => {
  const stored = getStoredApiKey();
  if (stored) return stored;
  return process.env.GEMINI_API_KEY;
};
