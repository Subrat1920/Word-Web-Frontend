import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Send } from 'lucide-react';

export default function Chat() {
  const [messages, setMessages] = useState<{role: string, text: string}[]>([]);
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessages = [
      ...messages,
      { role: 'user', text: input.trim() },
      { role: 'bot', text: 'AI response will come here' }
    ];

    setMessages(newMessages);
    setInput('');
  };

  return (
    <div className="page-container max-w-3xl mx-auto h-screen flex flex-col pt-4">
      <header className="flex items-center gap-4 mb-4 shrink-0">
        <button onClick={() => navigate(-1)} className="btn-glass p-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold gradient-text">AI Chat</h1>
      </header>

      <div className="glass-card flex-1 flex flex-col overflow-hidden p-4">
        <div className="flex-1 overflow-y-auto mb-4 flex flex-col gap-3 pr-2" style={{ scrollbarWidth: 'thin' }}>
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-text-secondary">
              Start a conversation with AI!
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isUser = msg.role === 'user';
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: isUser ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                    isUser 
                      ? 'bg-gradient-to-r from-primary to-accent text-white self-end rounded-br-sm' 
                      : 'bg-white/60 text-text-primary self-start rounded-bl-sm border border-white/40'
                  }`}
                >
                  {msg.text}
                </motion.div>
              );
            })
          )}
        </div>

        <div className="shrink-0 flex gap-2">
          <input 
            type="text" 
            placeholder="Ask something..." 
            className="input-glass flex-1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            className="w-14 h-14 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary-hover transition-colors shrink-0"
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
