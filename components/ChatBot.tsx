
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Send, User, X, MessageSquare, Terminal, ChevronDown, Calendar, ExternalLink, Mic, Square, Loader2 } from 'lucide-react';
import { Message } from '../types';
import { getGeminiResponse } from '../services/geminiService';

export interface ChatBotHandle {
  openWithQuery: (query: string) => void;
}

const CALENDAR_URL = "https://calendar.app.google/Mgzd2ZWjfv6Sz6sK7";
const FALLBACK_CALENDAR_URL = "https://calendar.app.google/o9QcV8uPcdbidcUs66";
const SPECIAL_CTA = "Schedule a consultation with an SG partner to shape your investment strategy";
const FALLBACK_PHRASE = "We haven't written about that yet, but our lawyers will know. Book a call with them here:";

// Updated SG Logo to match homepage style but sized for chat bubbles
const ChatSGLogo = ({ className = "text-xs" }: { className?: string }) => (
  <span className={`text-[#50b250] font-black tracking-tighter leading-none select-none ${className}`}>SG</span>
);

const ChatBot = forwardRef<ChatBotHandle>((_, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Intelligence Link Established. Accessing SG Knowledge Store. How can I assist your legal or investment inquiry today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [userQuestionCount, setUserQuestionCount] = useState(0);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useImperativeHandle(ref, () => ({
    openWithQuery: (query: string) => {
      setIsOpen(true);
      handleSend(query);
    }
  }));

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, isOpen, isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Data = (reader.result as string).split(',')[1];
          handleSend("", { data: base64Data, mimeType: 'audio/webm' });
        };
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied:", err);
      alert("Please allow microphone access to use voice queries.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSend = async (overrideInput?: string, audioData?: { data: string; mimeType: string }) => {
    const userMessage = (overrideInput || input).trim();
    if (!userMessage && !audioData || isLoading) return;

    const currentCount = userQuestionCount + 1;
    setUserQuestionCount(currentCount);

    if (!overrideInput) setInput('');
    
    const displayText = audioData ? (userMessage ? userMessage : "🎤 [Voice Inquiry sent]") : userMessage;
    setMessages(prev => [...prev, { role: 'user', text: displayText }]);
    setIsLoading(true);

    let response = await getGeminiResponse(messages, userMessage, audioData);
    
    // Original 3rd question CTA logic
    if (currentCount === 3 && response !== FALLBACK_PHRASE) {
      response = `${response}\n\n${SPECIAL_CTA}`;
    }
    
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 p-5 bg-[#0d311b] hover:bg-[#1a4a2a] text-white rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 z-50 flex items-center justify-center border border-white/10"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* Chat Area Overlay */}
      <div className={`fixed inset-0 z-50 flex items-end justify-center md:items-center md:justify-end md:pr-8 md:pb-8 transition-all duration-500 bg-[#0d311b]/20 backdrop-blur-sm ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`w-full max-w-2xl bg-white border border-slate-200 rounded-t-3xl md:rounded-2xl shadow-[0_20px_60px_-15px_rgba(13,49,27,0.3)] transition-all duration-500 flex flex-col overflow-hidden ${isOpen ? 'translate-y-0 scale-100 h-[85vh] md:h-[750px]' : 'translate-y-20 scale-95 h-0'}`}>
          
          {/* Corporate Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center space-x-3">
              {/* Terminal Icon - Hidden on mobile */}
              <div className="hidden md:block p-2 bg-[#50b250]/10 rounded-lg border border-[#50b250]/20">
                <Terminal className="w-5 h-5 text-[#50b250]" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-[0.05em] uppercase text-[#0d311b]">SG INTELLIGENCE</h3>
                {/* Verified Node Status - Hidden on mobile */}
                <div className="hidden md:flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 bg-[#50b250] rounded-full animate-pulse" />
                  <span className="text-[10px] text-[#50b250] font-bold uppercase tracking-wider">Verified Secure Node</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-[#0d311b] transition-all"
            >
              <ChevronDown className="w-6 h-6" />
            </button>
          </div>

          {/* Chat Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-white">
            {messages.map((m, i) => {
              const isFallback = m.role === 'model' && m.text.includes(FALLBACK_PHRASE);
              const isSpecialCTA = m.role === 'model' && m.text.includes(SPECIAL_CTA);
              
              return (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-4`}>
                    <div className={`flex-shrink-0 p-2.5 rounded-xl border shadow-sm flex items-center justify-center min-w-[40px] min-h-[40px] ${m.role === 'user' ? 'bg-[#50b250] border-[#50b250]' : 'bg-[#0d311b] border-[#0d311b]'}`}>
                      {m.role === 'user' ? (
                        <User className="w-5 h-5 text-white" />
                      ) : (
                        <ChatSGLogo className="text-sm" />
                      )}
                    </div>
                    <div className={`relative p-4 rounded-xl text-[15px] leading-relaxed tracking-wide shadow-sm ${m.role === 'user' ? 'bg-slate-50 text-[#0d311b] rounded-tr-none border border-slate-200' : 'bg-white text-[#0d311b] rounded-tl-none border border-slate-100'}`}>
                      <div className="whitespace-pre-wrap font-medium">{m.text}</div>
                      
                      {isFallback && (
                        <div className="mt-4 pt-4 border-t border-slate-100">
                          <a 
                            href={FALLBACK_CALENDAR_URL} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#50b250] hover:bg-[#45a045] text-white text-sm font-bold rounded-lg transition-all shadow-md group"
                          >
                            <Calendar className="w-4 h-4" />
                            <span>Book a Call</span>
                            <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                          </a>
                        </div>
                      )}

                      {isSpecialCTA && (
                        <div className="mt-4 pt-4 border-t border-slate-100">
                          <a 
                            href={CALENDAR_URL} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#50b250] hover:bg-[#45a045] text-white text-sm font-bold rounded-lg transition-all shadow-md group"
                          >
                            <Calendar className="w-4 h-4" />
                            <span>Consult Investment Partner</span>
                            <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {isRecording && (
               <div className="flex justify-end">
                <div className="flex max-w-[85%] flex-row-reverse items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-red-600 border border-red-500 shadow-md">
                    <Mic className="w-5 h-5 text-white animate-pulse" />
                  </div>
                  <div className="flex items-center space-x-2 p-4 bg-red-50 rounded-xl rounded-tr-none border border-red-100 text-red-600 text-sm font-bold">
                    <span>Recording Audio...</span>
                  </div>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex max-w-[85%] items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-[#0d311b] border border-[#0d311b] flex items-center justify-center min-w-[40px] min-h-[40px] shadow-sm">
                    <ChatSGLogo className="text-sm" />
                  </div>
                  <div className="flex items-center space-x-2 p-4 bg-slate-50 rounded-xl rounded-tl-none border border-slate-200">
                    <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Accessing Intelligence</span>
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-[#50b250] rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-1 h-1 bg-[#50b250] rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-1 h-1 bg-[#50b250] rounded-full animate-bounce" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-slate-100 bg-slate-50">
            <div className="relative group">
              <div className="relative flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-all focus-within:shadow-md focus-within:border-[#50b250]/50">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={isRecording ? "Listening..." : "Inquire about investment protocols..."}
                  className={`w-full bg-transparent py-4 pl-6 pr-24 text-[#0d311b] placeholder:text-slate-400 focus:outline-none text-[15px] font-medium ${isRecording ? 'italic' : ''}`}
                />
                
                <div className="absolute right-3 flex items-center space-x-1">
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`p-2.5 rounded-lg transition-all ${isRecording ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:text-[#50b250] hover:bg-slate-50'}`}
                  >
                    {isRecording ? <Square className="w-4 h-4 fill-current" /> : <Mic className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => handleSend()}
                    disabled={isLoading || isRecording || !input.trim()}
                    className={`p-2.5 rounded-lg transition-all ${isLoading || isRecording || !input.trim() ? 'text-slate-300' : 'text-[#50b250] hover:text-white hover:bg-[#50b250] shadow-sm'}`}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            {/* Removed RAG info on mobile using hidden md:flex */}
            <div className="mt-4 hidden md:flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-wider font-bold">
              <span>SG RAG Protocol</span>
              <span className="text-[#50b250]/80">SG-NETWORK-INTELLIGENCE</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

ChatBot.displayName = 'ChatBot';
export default ChatBot;
