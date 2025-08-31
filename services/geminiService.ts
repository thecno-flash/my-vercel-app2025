import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import type { DesignStyle } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const redesignRoom = async (
  base64Image: string,
  mimeType: string,
  style: DesignStyle
): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: `أعد تصميم هذه الغرفة بأسلوب ${style}. اجعلها تبدو واقعية.`,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData?.data) {
            return part.inlineData.data;
        }
    }

    throw new Error('لم يتم العثور على صورة في استجابة الذكاء الاصطناعي.');
  } catch (error) {
    console.error('Error redesigning room:', error);
    if (error instanceof Error) {
        throw new Error(`فشل في إنشاء التصميم: ${error.message}`);
    }
    throw new Error('حدث خطأ غير معروف أثناء إنشاء التصميم.');
  }
};
