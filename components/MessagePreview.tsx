import React from 'react';
import { GeneratedContent, TrackingFormData } from '../types';

interface MessagePreviewProps {
  content: GeneratedContent;
  customerData: TrackingFormData;
  onReset: () => void;
}

const MessagePreview: React.FC<MessagePreviewProps> = ({ content, customerData, onReset }) => {
  
  const handleSendWhatsApp = () => {
    // Remove non-numeric characters for the link
    const cleanPhone = customerData.customerPhone.replace(/\D/g, '');
    const encodedText = encodeURIComponent(content.whatsappMessage);
    const url = `https://wa.me/${cleanPhone}?text=${encodedText}`;
    window.open(url, '_blank');
  };

  const handleSendEmail = () => {
    const encodedSubject = encodeURIComponent(content.subject);
    const encodedBody = encodeURIComponent(content.emailBody);
    const url = `mailto:${customerData.customerEmail}?subject=${encodedSubject}&body=${encodedBody}`;
    window.open(url, '_blank');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Texto copiado para a área de transferência!');
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 border border-gray-100 animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Mensagens Geradas</h2>
        <button 
          onClick={onReset}
          className="text-sm text-gray-500 hover:text-blue-600 font-medium transition-colors flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Novo Envio
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* WhatsApp Section */}
        <div className="bg-green-50 rounded-xl p-5 border border-green-100 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-3 text-green-700 font-semibold">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z" />
            </svg>
            WhatsApp
          </div>
          <div className="bg-white p-4 rounded-lg border border-green-100 shadow-sm flex-grow whitespace-pre-wrap text-sm text-gray-700 mb-4 font-sans">
            {content.whatsappMessage}
          </div>
          <div className="flex gap-2 mt-auto">
            <button
              onClick={handleSendWhatsApp}
              disabled={!customerData.customerPhone}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors ${
                customerData.customerPhone 
                ? 'bg-green-600 text-white hover:bg-green-700 shadow-sm' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
               Enviar Agora
            </button>
             <button
              onClick={() => handleCopy(content.whatsappMessage)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 bg-white"
              title="Copiar texto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
          {!customerData.customerPhone && (
            <p className="text-xs text-red-500 mt-2">Adicione um telefone para enviar direto.</p>
          )}
        </div>

        {/* Email Section */}
        <div className="bg-blue-50 rounded-xl p-5 border border-blue-100 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-3 text-blue-700 font-semibold">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            E-mail
          </div>
          
          <div className="mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase">Assunto:</span>
            <div className="bg-white p-2 rounded border border-blue-100 text-sm text-gray-800">
                {content.subject}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm flex-grow whitespace-pre-wrap text-sm text-gray-700 mb-4 font-sans">
            {content.emailBody}
          </div>
          
          <div className="flex gap-2 mt-auto">
             <button
              onClick={handleSendEmail}
              disabled={!customerData.customerEmail}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors ${
                customerData.customerEmail 
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Abrir E-mail
            </button>
            <button
              onClick={() => handleCopy(`${content.subject}\n\n${content.emailBody}`)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 bg-white"
              title="Copiar texto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
           {!customerData.customerEmail && (
            <p className="text-xs text-red-500 mt-2">Adicione um e-mail para abrir o cliente.</p>
          )}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg shadow-md transition-all transform hover:-translate-y-0.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
          </svg>
          Voltar e Criar Novo Rastreio
        </button>
      </div>
    </div>
  );
};

export default MessagePreview;