
import { GoogleGenAI } from "@google/genai";

export interface SearchResult {
  name: string;
  description: string;
  address: string;
  category: 'food' | 'attraction' | 'accommodation';
  url?: string;
}

export async function searchPlacesGrounding(query: string, destination: string): Promise<SearchResult[]> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Find 5 high-quality, up-to-date recommendations for "${query}" in ${destination}. 
    Focus on places travelers would actually visit.
    For each place, provide its name, a short descriptive summary, and its physical address.
    Categorize each as 'food', 'attraction', or 'accommodation'.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              name: { type: "STRING" },
              description: { type: "STRING" },
              address: { type: "STRING" },
              category: { type: "STRING", enum: ["food", "attraction", "accommodation"] }
            },
            required: ["name", "description", "address", "category"]
          }
        }
      },
    });

    const results = JSON.parse(response.text || "[]") as SearchResult[];
    
    // Extract grounding URLs if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks && groundingChunks.length > 0) {
      results.forEach((res, i) => {
        // Simple heuristic: map first few chunks to results
        if (groundingChunks[i]?.web?.uri) {
          res.url = groundingChunks[i].web.uri;
        }
      });
    }

    return results;
  } catch (error) {
    console.error("Discovery error:", error);
    return [];
  }
}
