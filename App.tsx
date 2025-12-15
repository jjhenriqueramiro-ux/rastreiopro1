import React, { useState } from 'react';
import TrackingForm from './components/TrackingForm';
import MessagePreview from './components/MessagePreview';
import { TrackingFormData, GeneratedContent } from './types';
import { generateNotificationMessage } from './services/geminiService';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [customerData, setCustomerData] = useState<TrackingFormData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (data: TrackingFormData) => {
    setLoading(true);
    setError(null);
    setCustomerData(data);
    
    try {
      const result = await generateNotificationMessage(data);
      setGeneratedContent(result);
    } catch (err: any) {
      // Exibe a mensagem de erro real vinda do serviço
      const msg = err.message || "Erro desconhecido ao gerar mensagem.";
      setError(`Erro: ${msg}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setGeneratedContent(null);
    setCustomerData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">RastreioZap Pro</h1>
              <p className="text-xs text-gray-500">Notificações automáticas de envio</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-5xl mx-auto px-4 py-8 w-full">
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 font-medium">Ops! Algo deu errado:</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {!generatedContent ? (
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Envie notificações em segundos</h2>
                <p className="text-gray-600">Preencha os dados do envio e nossa IA criará mensagens personalizadas para WhatsApp e E-mail.</p>
              </div>
              <TrackingForm onSubmit={handleFormSubmit} isLoading={loading} />
            </div>
          ) : (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               {customerData && (
                <MessagePreview 
                  content={generatedContent} 
                  customerData={customerData}
                  onReset={handleReset}
                />
               )}
             </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} RastreioZap Pro. Desenvolvido com Google Gemini.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;