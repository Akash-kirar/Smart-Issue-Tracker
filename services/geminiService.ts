import { GoogleGenAI, Type } from "@google/genai";
import { Issue, Priority } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-3-flash-preview';

interface AnalysisResult {
  priority: string;
  department: string;
  summary: string;
  suggestedAction: string;
}

export const analyzeIssue = async (description: string, title: string): Promise<AnalysisResult> => {
  try {
    const prompt = `
      You are an intelligent IT service desk assistant. Analyze the following issue report.
      
      Title: ${title}
      Description: ${description}

      Task:
      1. Determine the Priority (LOW, MEDIUM, HIGH, CRITICAL).
      2. Categorize into a Department (IT, HR, Facilities, Finance, Legal).
      3. Provide a one-sentence technical summary.
      4. Suggest a clear first step for resolution.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            priority: { type: Type.STRING, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"] },
            department: { type: Type.STRING },
            summary: { type: Type.STRING },
            suggestedAction: { type: Type.STRING }
          }
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No response from AI");
    
    return JSON.parse(resultText) as AnalysisResult;

  } catch (error) {
    console.error("Gemini analysis failed:", error);
    // Fallback defaults
    return {
      priority: "MEDIUM",
      department: "General",
      summary: "Analysis failed, please review manually.",
      suggestedAction: "Review manually."
    };
  }
};
