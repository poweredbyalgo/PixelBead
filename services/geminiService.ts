
import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Generate text-to-image (legacy support if needed)
export const generateBeadImage = async (prompt: string): Promise<string> => {
  try {
    const enhancedPrompt = `A simple, clean, high-contrast 2D vector graphic or pixel art style illustration of ${prompt}. Suitable for pixel art conversion. Solid flat colors, white background.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: enhancedPrompt,
          },
        ],
      },
      config: {
          responseModalities: [Modality.IMAGE],
      },
    });

    // Extract image
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts && parts[0]?.inlineData) {
       const base64ImageBytes = parts[0].inlineData.data;
       const mimeType = parts[0].inlineData.mimeType || 'image/png';
       return `data:${mimeType};base64,${base64ImageBytes}`;
    }

    throw new Error("No image data returned");
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};

// Image-to-Image Stylization
export const stylizeImage = async (base64Image: string, prompt: string): Promise<string> => {
  try {
    // Remove data url prefix if present for the API call
    const base64Data = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
    const mimeType = base64Image.match(/^data:image\/(png|jpeg|jpg|webp);base64,/)?.[1] ? `image/${base64Image.match(/^data:image\/(png|jpeg|jpg|webp);base64,/)?.[1]}` : 'image/png';

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
          responseModalities: [Modality.IMAGE],
      },
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (parts && parts[0]?.inlineData) {
       const base64ImageBytes = parts[0].inlineData.data;
       const returnMimeType = parts[0].inlineData.mimeType || 'image/png';
       return `data:${returnMimeType};base64,${base64ImageBytes}`;
    }
    
    throw new Error("No stylized image returned");
  } catch (error) {
    console.error("Gemini Stylization Error:", error);
    throw error;
  }
};
