import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Send, Sparkles, Wand2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

const getAIClient = () => {
  if (!aiClient) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Missing GEMINI_API_KEY environment variable. Please configure it in your deployment settings.");
    }
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
};

export default function AIAssistant() {
  const { role } = useAuth();
  const [messages, setMessages] = useState([
    { id: 1, text: role === 'teacher' ? 'Xin chào! Tôi là Trợ giảng AI của bạn. Tôi có thể giúp chấm điểm bài luận, tạo câu hỏi trắc nghiệm hoặc phân tích học lực của học sinh. Bạn cần giúp gì?' : 'Chào bạn! Mình là Gia sư Hóa học AI. Hãy hỏi mình bất kỳ khái niệm hóa học nào, hoặc nhờ giải bài tập nhé!', isAi: true }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    // Add user message
    const userMsg = { id: Date.now(), text: input, isAi: false };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
       // Format history for Gemini API
       // Note: the model used here is gemini-3.1-flash-preview because it's fast. Or pro if preferred.
       const systemInstruction = role === 'teacher' 
          ? "Bạn là một trợ lý giảng dạy AI cho một giáo viên Hóa học. Hãy giữ câu trả lời của bạn ngắn gọn, mang tính sư phạm và hữu ích. Hãy trả lời bằng tiếng Việt." 
          : "Bạn là một gia sư AI dành cho một học sinh đang học Hóa học. Hãy giữ câu trả lời của bạn mang tính hướng dẫn, khích lệ và rõ ràng. Hãy trả lời bằng tiếng Việt.";

       // Use Chat session for context
       const chat = getAIClient().chats.create({
          model: "gemini-3.1-pro-preview",
          config: {
             systemInstruction: systemInstruction,
          }
       });

       // We aren't retaining full history in the `chat` object across sends in this simple example, 
       // but we could send the full history. For simplicity, we just send the current input.
       const response = await chat.sendMessage({ message: input });
       
       setMessages((prev) => [
         ...prev, 
         { id: Date.now(), text: response.text || "Xin lỗi, tôi không thể xử lý yêu cầu đó.", isAi: true }
       ]);
    } catch (err) {
       console.error("Failed to generate content", err);
       setMessages((prev) => [
         ...prev, 
         { id: Date.now(), text: "Đã xảy ra lỗi khi kết nối với bộ não của tôi. Vui lòng kiểm tra API key.", isAi: true }
       ]);
    } finally {
       setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] w-full max-w-4xl mx-auto gap-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center shadow-lg">
          <Bot size={28} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">ChemNexus Trợ Giảng AI</h1>
          <p className="text-brand-blue text-sm flex items-center gap-1">
            <Sparkles size={14} /> Powered by Gemini
          </p>
        </div>
      </div>

      <div className="flex-1 glass-panel rounded-3xl overflow-hidden flex flex-col pt-4 relative">
        {/* Background Logo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
          <Bot size={300} />
        </div>

        <div className="flex-1 overflow-y-auto px-6 space-y-6 pb-6">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.isAi ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`max-w-[80%] rounded-2xl p-4 shadow-md ${
                  msg.isAi 
                    ? 'bg-slate-800/80 border border-slate-700/50 text-slate-200 rounded-tl-none' 
                    : 'bg-gradient-to-br from-brand-blue/20 to-brand-purple/20 border border-brand-blue/30 text-white rounded-tr-none'
                }`}>
                  {msg.isAi && (
                    <div className="flex items-center gap-2 mb-2 text-brand-blue">
                      <Wand2 size={16} /> 
                      <span className="text-xs font-bold uppercase tracking-wider">Gia Sư AI</span>
                    </div>
                  )}
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
             <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl rounded-tl-none p-4 flex gap-2 w-20">
                  <span className="w-2 h-2 rounded-full bg-brand-blue animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-brand-blue animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-brand-blue animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-slate-900/50 border-t border-white/5 backdrop-blur-md">
          <div className="relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={role === 'teacher' ? "Yêu cầu AI phân tích điểm số..." : "Hỏi một câu hỏi hóa học..."}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-4 pr-12 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="absolute right-2 top-2 bottom-2 aspect-square rounded-lg bg-brand-blue text-slate-900 flex items-center justify-center hover:bg-brand-blue/80 transition-colors disabled:opacity-50 disabled:hover:bg-brand-blue"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
