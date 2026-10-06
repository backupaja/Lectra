import React, { useState, useRef, useEffect } from 'react';
import { AuthService } from '../../services/authService';
import ReactMarkdown from 'react-markdown';

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'model', text: string}[]>([
    { role: 'model', text: 'Halo! Saya LECTRA AI. Ada yang bisa saya bantu terkait informasi anggaran Anda hari ini?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const session = await AuthService.getSession();
      const token = session?.access_token;
      
      if (!token) {
        throw new Error("No active session");
      }

      // Prepare history format for the backend
      const history = messages.slice(1).map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        text: msg.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: userText,
          history: history
        })
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          throw new Error("Unauthorized");
        }
        if (res.status === 429) {
           setMessages(prev => [...prev, { role: 'model', text: 'Maaf, kuota layanan AI saat ini sedang penuh. Silakan coba lagi nanti.' }]);
           return;
        }
        throw new Error("Server error");
      }

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'model', text: data.reply || 'Maaf, respons tidak terbaca.' }]);
    } catch (error) {
      console.error("Error calling chat endpoint:", error);
      setMessages(prev => [...prev, { role: 'model', text: 'Maaf, terjadi kesalahan atau Anda tidak memiliki akses ke layanan ini.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-[#8F2438] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#7a1c2d] hover:scale-105 transition-all z-50 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 16.25V18a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18V6.25A2.25 2.25 0 015.25 4h13.5A2.25 2.25 0 0121 6.25v10z" />
        </svg>
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 w-full max-w-sm sm:w-[350px] bg-white transition-colors rounded-[20px] shadow-2xl border border-[#E4E7EC] flex flex-col z-50 overflow-hidden transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`} style={{ height: '500px', maxHeight: 'calc(100vh - 48px)' }}>
        {/* Header */}
        <div className="bg-[#8F2438] px-4 py-3 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">AI</span>
            </div>
            <div>
              <h3 className="font-semibold text-sm leading-tight">LECTRA Assistant</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                <p className="text-[10px] text-white/80 leading-none">Online</p>
              </div>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-4 overflow-y-auto bg-[#F9FAFB] flex flex-col gap-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'self-end' : 'self-start'}`}>
              <div className={`px-3.5 py-2.5 rounded-[14px] text-[13px] shadow-sm leading-relaxed ${msg.role === 'user' ? 'bg-[#8F2438] text-white rounded-tr-sm' : 'bg-white transition-colors border border-[#E4E7EC] text-[#1F2937] rounded-tl-sm'}`}>
                {msg.role === 'user' ? (
                  msg.text.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i !== msg.text.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))
                ) : (
                  <div className="prose prose-sm prose-p:my-1 prose-ul:my-1 prose-li:my-0 max-w-none text-[#1F2937]">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                )}
              </div>
              <span className={`text-[10px] text-[#98A2B3] mt-1.5 ${msg.role === 'user' ? 'text-right' : 'text-left px-1'}`}>
                {msg.role === 'user' ? 'Anda' : 'LECTRA AI'}
              </span>
            </div>
          ))}
          {isLoading && (
             <div className="flex flex-col max-w-[85%] self-start">
               <div className="px-4 py-3.5 rounded-[14px] shadow-sm bg-white transition-colors border border-[#E4E7EC] rounded-tl-sm flex gap-1.5">
                 <div className="w-1.5 h-1.5 bg-[#98A2B3] rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                 <div className="w-1.5 h-1.5 bg-[#98A2B3] rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                 <div className="w-1.5 h-1.5 bg-[#98A2B3] rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-white transition-colors border-t border-[#E4E7EC] shrink-0">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ketik pesan Anda..."
              className="flex-1 text-[13px] bg-[#F7F7F8] border border-transparent rounded-full px-4 py-2.5 outline-none focus:bg-white transition-colors focus:border-[#8F2438]/30 focus:ring-2 focus:ring-[#8F2438]/10 transition-all placeholder:text-[#98A2B3]"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 rounded-full bg-[#8F2438] text-white flex items-center justify-center shrink-0 disabled:opacity-50 disabled:bg-[#D9DDE3] hover:bg-[#7a1c2d] transition-colors"
            >
              <svg className="w-4 h-4 translate-x-[-1px] translate-y-[1px]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
