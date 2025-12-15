import { GoogleGenAI, Type } from "@google/genai";
import { TrackingFormData, GeneratedContent } from "../types";

// Função para obter a API Key com prioridade para o padrão Vite
const getApiKey = (): string => {
  // 1. Padrão VITE (Recomendado para este projeto)
  // O Vite expõe variáveis que começam com VITE_ através de import.meta.env
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
    // @ts-ignore
    return import.meta.env.VITE_API_KEY;
  }

  // 2. Fallbacks (Node.js, Webpack, etc)
  if (typeof process !== 'undefined' && process.env) {
    if (process.env.API_KEY) return process.env.API_KEY;
    if (process.env.REACT_APP_API_KEY) return process.env.REACT_APP_API_KEY;
    if (process.env.NEXT_PUBLIC_API_KEY) return process.env.NEXT_PUBLIC_API_KEY;
  }

  return '';
};

export const generateNotificationMessage = async (data: TrackingFormData): Promise<GeneratedContent> => {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error("Chave de API não encontrada! Na Vercel, crie uma variável de ambiente chamada 'VITE_API_KEY' com o valor da sua chave.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Você é um assistente de e-commerce profissional.
    Gere um JSON com mensagens de notificação de envio.

    Dados:
    - Cliente: ${data.customerName}
    - Produto: ${data.productName}
    - Transportadora: ${data.carrier}
    - Código: ${data.trackingCode}
    ${data.trackingLink ? `- Link: ${data.trackingLink}` : ''}
    ${data.invoiceNumber ? `- NF: ${data.invoiceNumber}` : ''}
    
    Requisitos:
    1. 'whatsappMessage': Use emojis. Seja breve. ${data.trackingLink ? 'Use o link fornecido.' : 'Inclua link genérico da transportadora.'}
    2. 'emailBody': Texto cordial e formatado.
    3. 'subject': Assunto do e-mail.
    
    Retorne APENAS JSON válido.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            whatsappMessage: { type: Type.STRING },
            emailBody: { type: Type.STRING }
          },
          required: ["subject", "whatsappMessage", "emailBody"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as GeneratedContent;
    } else {
      throw new Error("A IA retornou uma resposta vazia.");
    }
  } catch (error: any) {
    console.error("Erro detalhado do Gemini:", error);
    // Repassa a mensagem de erro original para ajudar no debug
    throw new Error(error.message || "Falha na comunicação com a IA.");
  }
};