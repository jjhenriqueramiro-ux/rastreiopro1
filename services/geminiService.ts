import { GoogleGenAI, Type } from "@google/genai";
import { TrackingFormData, GeneratedContent } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateNotificationMessage = async (data: TrackingFormData): Promise<GeneratedContent> => {
  if (!apiKey) {
    throw new Error("API Key não encontrada. Por favor, verifique suas variáveis de ambiente.");
  }

  const prompt = `
    Você é um assistente de e-commerce profissional e amigável.
    Gere uma mensagem de notificação de envio para um cliente.
    
    Dados do pedido:
    - Cliente: ${data.customerName}
    - Produto: ${data.productName}
    - Transportadora: ${data.carrier}
    - Código de Rastreio: ${data.trackingCode}
    ${data.trackingLink ? `- Link de Rastreio: ${data.trackingLink}` : ''}
    ${data.invoiceNumber ? `- Nota Fiscal: ${data.invoiceNumber}` : ''}
    
    Instruções:
    1. Crie um assunto de e-mail curto e atraente.
    2. Crie uma mensagem para WhatsApp que seja direta, use emojis adequados (caminhão, caixa, brilhos), inclua o código de rastreio.
       ${data.trackingLink ? `Use EXATAMENTE este link para o rastreio: ${data.trackingLink}` : 'Inclua um link de rastreamento genérico adequado à transportadora (se for Correios, use https://rastreamento.correios.com.br/app/index.php).'}
       ${data.invoiceNumber ? `Cite que a Nota Fiscal ${data.invoiceNumber} foi emitida.` : ''}
    3. Crie um corpo de e-mail mais formal, mas cordial, agradecendo a compra e fornecendo os detalhes.
    
    Retorne APENAS o JSON.
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
            subject: { type: Type.STRING, description: "Assunto do e-mail" },
            whatsappMessage: { type: Type.STRING, description: "Mensagem otimizada para WhatsApp com emojis" },
            emailBody: { type: Type.STRING, description: "Corpo do e-mail completo" }
          },
          required: ["subject", "whatsappMessage", "emailBody"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as GeneratedContent;
    } else {
      throw new Error("Não foi possível gerar a mensagem.");
    }
  } catch (error) {
    console.error("Erro ao chamar Gemini:", error);
    throw error;
  }
};