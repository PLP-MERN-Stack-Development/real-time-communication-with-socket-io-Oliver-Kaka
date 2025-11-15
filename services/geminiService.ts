
import { GoogleGenAI, Chat } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const textModel = 'gemini-2.5-flash';
const multiModalModel = 'gemini-2.5-flash';

const chatInstances = new Map<string, Chat>();

const getChatSession = (chatId: string, withImage: boolean): Chat => {
  if (chatInstances.has(chatId)) {
    return chatInstances.get(chatId)!;
  }
  
  const model = withImage ? multiModalModel : textModel;
  const newChat = ai.chats.create({
    model: model,
    config: {
        systemInstruction: 'You are a helpful and friendly AI assistant. Your name is Gemini. Format your responses using markdown.',
    }
  });
  chatInstances.set(chatId, newChat);
  return newChat;
};

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      }
    };
    reader.readAsDataURL(file);
  });
  
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export async function* generateResponseStream(chatId: string, prompt: string, image?: File) {
  const chat = getChatSession(chatId, !!image);
  
  let fullPrompt: any = { message: prompt };
  
  if (image) {
      const imagePart = await fileToGenerativePart(image);
      fullPrompt = {
          message: {
              parts: [
                  { text: prompt },
                  imagePart
              ]
          }
      };
  }

  const result = await chat.sendMessageStream(fullPrompt);

  for await (const chunk of result) {
    yield chunk.text;
  }
}


export const generateTitle = async (prompt: string): Promise<string> => {
    try {
        const result = await ai.models.generateContent({
            model: textModel,
            contents: `Generate a short, concise title (4 words max) for this user prompt: "${prompt}"`,
        });
        const title = result.text.replace(/"/g, '').trim();
        return title || 'New Chat';
    } catch (error) {
        console.error('Error generating title:', error);
        return 'New Chat';
    }
};
