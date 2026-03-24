import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Search, LogOut, MessageSquare, Lightbulb, Quote, AlignLeft, List as ListIcon, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export default function Home() {
  const [word, setWord] = useState('');
  const [loading, setLoading] = useState(false);
  const [words, setWords] = useState<any[]>([]);
  const [latestWord, setLatestWord] = useState<any | null>(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    if (!userId) { navigate('/login'); return; }
    fetchWords();
  }, [userId, navigate]);

  const fetchWords = async () => {
    try {
      const response = await api.get(`/words?user_id=${userId}&filter_type=mine`);
      if (response.status === 200 && response.data.length > 0) {
        setWords(response.data);
        setLatestWord(response.data[0]);
      }
    } catch (err) { console.error('Error fetching words', err); }
  };

  const handleGenerate = async () => {
    if (!word.trim()) return;
    setLoading(true);
    try {
      const response = await api.post('/word', { word: word.trim(), user_id: parseInt(userId as string) });
      if (response.status === 200) {
        const newWord = {
          word: word.trim(),
          meaning: response.data.meaning || '',
          definition: response.data.definition || '',
          example: response.data.example || '',
        };
        setLatestWord(newWord);
        setWords(prev => [newWord, ...prev]);
        setWord('');
        await fetchWords();
      }
    } catch (err) {
      console.error('Error generating meaning', err);
      alert('Failed to generate meaning');
    } finally { setLoading(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  const renderExampleText = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) =>
      i % 2 === 1
        ? <strong key={i} style={{ color: '#c4b5fd', fontWeight: 700 }}>{part}</strong>
        : <span key={i}>{part}</span>
    );
  };

  /* ─── Shared style tokens ─────────────────────────────── */
  const page: React.CSSProperties = {
    position: 'fixed', inset: 0,
    background: 'linear-gradient(135deg, #13111c 0%, #1e1a36 50%, #13111c 100%)',
    fontFamily: "'Inter', system-ui, sans-serif",
    color: '#fff',
    display: 'flex', flexDirection: 'column',
    overflowY: 'auto',
    zIndex: 9999,
  };

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.06)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
  };

  const iconBtnStyle: React.CSSProperties = {
    width: '40px', height: '40px', borderRadius: '12px',
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.1)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', color: 'rgba(255,255,255,0.65)',
    transition: 'background 0.2s',
  };

  return (
    <div style={page}>
      {/* Background glows */}
      <div style={{ position: 'fixed', top: '-20%', left: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-20%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '680px', width: '100%', margin: '0 auto', padding: '0 1.25rem 4rem', flex: 1, position: 'relative', zIndex: 1 }}>

        {/* ── Header ── */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 0 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '11px', background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={19} strokeWidth={1.5} color="rgba(196,181,253,1)" />
            </div>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>AI Vocabulary</h1>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { icon: <ListIcon size={18} strokeWidth={1.5} />, action: () => navigate('/words'), label: 'Your Words' },
              { icon: <MessageSquare size={18} strokeWidth={1.5} />, action: () => navigate('/chat'), label: 'Chat' },
              { icon: <LogOut size={18} strokeWidth={1.5} />, action: handleLogout, label: 'Logout' },
            ].map(({ icon, action, label }) => (
              <button key={label} onClick={action} title={label} style={iconBtnStyle}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
              >{icon}</button>
            ))}
          </div>
        </header>

        {/* ── Hero chip ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
          <Sparkles size={14} strokeWidth={1.5} color="rgba(167,139,250,0.9)" />
          <span style={{ color: 'rgba(167,139,250,0.9)', fontSize: '12.5px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            AI-Powered Dictionary
          </span>
        </div>

        {/* ── Search bar ── */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} strokeWidth={1.5}
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)', pointerEvents: 'none' }} />
              <input
                type="text"
                placeholder="Enter a word to generate meaning…"
                value={word}
                onChange={e => setWord(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleGenerate()}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '14px',
                  padding: '14px 16px 14px 40px',
                  color: '#fff', fontSize: '15px', outline: 'none',
                  transition: 'border-color 0.2s, background 0.2s',
                }}
                onFocus={e => { e.target.style.borderColor = 'rgba(139,92,246,0.6)'; e.target.style.background = 'rgba(255,255,255,0.1)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.background = 'rgba(255,255,255,0.07)'; }}
              />
            </div>
            <motion.button
              onClick={handleGenerate}
              disabled={loading || !word.trim()}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: '0 22px',
                background: loading || !word.trim() ? 'rgba(139,92,246,0.35)' : 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                border: 'none', borderRadius: '14px',
                color: '#fff', fontSize: '14.5px', fontWeight: 600,
                cursor: loading || !word.trim() ? 'not-allowed' : 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: loading || !word.trim() ? 'none' : '0 6px 16px rgba(99,102,241,0.3)',
                transition: 'background 0.2s',
                display: 'flex', alignItems: 'center', gap: '7px',
              }}
            >
              {loading ? (
                <>
                  <svg style={{ animation: 'spin 1s linear infinite', width: 14, height: 14 }} viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                  Generating…
                </>
              ) : (<><Sparkles size={14} strokeWidth={2} /> Generate</>)}
            </motion.button>
          </div>

          <div style={{ marginTop: '10px', paddingLeft: '2px', fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>
            {words.length > 0 ? (
              <span><span style={{ color: 'rgba(167,139,250,0.9)', fontWeight: 600 }}>{words.length}</span> word{words.length !== 1 ? 's' : ''} in your collection</span>
            ) : (
              <span>Start by generating your first word</span>
            )}
          </div>
        </div>

        {/* ── Word Card ── */}
        <AnimatePresence mode="wait">
          {latestWord ? (
            <motion.div
              key={latestWord.word}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={cardStyle}
            >
              {/* Card header */}
              <div style={{
                padding: '1.4rem 1.6rem',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <BookOpen size={16} strokeWidth={1.5} color="#c4b5fd" />
                  </div>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em', textTransform: 'capitalize' }}>
                    {latestWord.word}
                  </h2>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(167,139,250,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em', background: 'rgba(139,92,246,0.15)', padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(139,92,246,0.2)' }}>
                  Latest
                </span>
              </div>

              {/* Card sections */}
              <div style={{ padding: '1.25rem 1.6rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[
                  { icon: <Lightbulb size={15} strokeWidth={1.5} color="#fbbf24" />, label: 'Meaning', text: latestWord.meaning, color: '#fde68a' },
                  { icon: <AlignLeft size={15} strokeWidth={1.5} color="#60a5fa" />, label: 'Definition', text: latestWord.definition, color: '#93c5fd' },
                ].filter(s => s.text).map(section => (
                  <div key={section.label}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '6px' }}>
                      <div style={{ width: '26px', height: '26px', borderRadius: '7px', background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {section.icon}
                      </div>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color: section.color, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{section.label}</span>
                    </div>
                    <p style={{ margin: 0, paddingLeft: '33px', color: 'rgba(255,255,255,0.72)', fontSize: '14.5px', lineHeight: '1.65' }}>
                      {section.text}
                    </p>
                  </div>
                ))}

                {latestWord.example && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '6px' }}>
                      <div style={{ width: '26px', height: '26px', borderRadius: '7px', background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Quote size={15} strokeWidth={1.5} color="#86efac" />
                      </div>
                      <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#86efac', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Example</span>
                    </div>
                    <p style={{ margin: 0, paddingLeft: '33px', color: 'rgba(255,255,255,0.62)', fontSize: '14.5px', lineHeight: '1.65', fontStyle: 'italic' }}>
                      "{renderExampleText(latestWord.example)}"
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ ...cardStyle, padding: '3rem 2rem', textAlign: 'center' }}
            >
              <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem' }}>
                <BookOpen size={26} strokeWidth={1.5} color="rgba(196,181,253,0.7)" />
              </div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', margin: 0 }}>
                Type a word above and hit <strong style={{ color: 'rgba(167,139,250,0.9)' }}>Generate</strong> to see its meaning
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(255,255,255,0.3); }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
