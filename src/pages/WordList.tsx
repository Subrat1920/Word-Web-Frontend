import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Lightbulb, AlignLeft, Quote, BookOpen } from 'lucide-react';
import { api } from '../services/api';

export default function WordList() {
  const [words, setWords] = useState<any[]>([]);
  const [filteredWords, setFilteredWords] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('mine');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    if (!userId) { navigate('/login'); return; }
    fetchWords();
  }, [userId, filterType]);

  const fetchWords = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/words?user_id=${userId}&filter_type=${filterType}`);
      if (response.status === 200) { setWords(response.data); setFilteredWords(response.data); }
    } catch (err) { console.error('Error fetching words', err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (!search.trim()) { setFilteredWords(words); return; }
    const lower = search.toLowerCase();
    setFilteredWords(words.filter(w => w.word.toLowerCase().includes(lower)));
  }, [search, words]);

  const renderExampleText = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) =>
      i % 2 === 1
        ? <strong key={i} style={{ color: '#c4b5fd', fontWeight: 700 }}>{part}</strong>
        : <span key={i}>{part}</span>
    );
  };

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.06)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '20px',
    boxShadow: '0 16px 32px rgba(0,0,0,0.25)',
    overflow: 'hidden',
  };

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '14px',
    padding: '13px 16px',
    color: '#fff', fontSize: '14.5px', outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, background 0.2s',
    width: '100%',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'linear-gradient(135deg, #13111c 0%, #1e1a36 50%, #13111c 100%)',
      fontFamily: "'Inter', system-ui, sans-serif",
      color: '#fff',
      overflowY: 'auto',
      zIndex: 9999,
    }}>
      {/* Background glows */}
      <div style={{ position: 'fixed', top: '-20%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-20%', left: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '680px', width: '100%', margin: '0 auto', padding: '0 1.25rem 4rem', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <header style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '1.5rem 0 2rem' }}>
          <button onClick={() => navigate(-1)}
            style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.65)', flexShrink: 0 }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
          >
            <ArrowLeft size={18} strokeWidth={1.5} />
          </button>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>Your Words</h1>
            <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
              {words.length} {words.length === 1 ? 'word' : 'words'} in collection
            </p>
          </div>
        </header>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
          <select value={filterType} onChange={e => setFilterType(e.target.value)}
            style={{ ...inputStyle, width: 'auto', minWidth: '140px', cursor: 'pointer', appearance: 'none', paddingRight: '36px', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
            onFocus={e => { e.target.style.borderColor = 'rgba(139,92,246,0.6)'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; }}
          >
            <option value="mine" style={{ background: '#1e1a36' }}>My Words</option>
            <option value="other" style={{ background: '#1e1a36' }}>Other Users</option>
            <option value="all" style={{ background: '#1e1a36' }}>All Words</option>
          </select>

          <div style={{ position: 'relative', flex: 1, minWidth: '160px' }}>
            <Search size={15} strokeWidth={1.5}
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)', pointerEvents: 'none' }} />
            <input type="text" placeholder="Search words…" value={search} onChange={e => setSearch(e.target.value)}
              style={{ ...inputStyle, paddingLeft: '38px' }}
              onFocus={e => { e.target.style.borderColor = 'rgba(139,92,246,0.6)'; e.target.style.background = 'rgba(255,255,255,0.1)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.background = 'rgba(255,255,255,0.07)'; }}
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '5rem 0' }}>
            <svg style={{ animation: 'spin 1s linear infinite', width: 28, height: 28 }} viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="rgba(139,92,246,0.25)" strokeWidth="3"/>
              <path d="M12 2a10 10 0 0 1 10 10" stroke="rgba(167,139,250,0.9)" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
        ) : filteredWords.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', ...cardStyle }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <BookOpen size={24} strokeWidth={1.5} color="rgba(196,181,253,0.7)" />
            </div>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '15px', margin: 0 }}>
              {search ? `No words matching "${search}"` : 'No words yet — go generate some!'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '2rem' }}>
            {filteredWords.map((item, index) => (
              <motion.div key={index} style={cardStyle}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.4) }}
              >
                {/* Card header */}
                <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <BookOpen size={15} strokeWidth={1.5} color="#c4b5fd" />
                    </div>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', margin: 0, textTransform: 'capitalize', letterSpacing: '-0.02em' }}>
                      {item.word}
                    </h2>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: item.user_id?.toString() === userId ? 'rgba(167,139,250,0.8)' : 'rgba(96,165,250,0.8)', textTransform: 'uppercase', letterSpacing: '0.07em', background: item.user_id?.toString() === userId ? 'rgba(139,92,246,0.12)' : 'rgba(59,130,246,0.12)', padding: '3px 9px', borderRadius: '20px', border: `1px solid ${item.user_id?.toString() === userId ? 'rgba(139,92,246,0.2)' : 'rgba(59,130,246,0.2)'}` }}>
                    {item.user_id?.toString() === userId ? 'You' : 'Partner'}
                  </span>
                </div>

                {/* Sections */}
                <div style={{ padding: '1.1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    { icon: <Lightbulb size={13} strokeWidth={1.5} color="#fbbf24" />, label: 'Meaning', text: item.meaning, color: '#fde68a' },
                    { icon: <AlignLeft size={13} strokeWidth={1.5} color="#60a5fa" />, label: 'Definition', text: item.definition, color: '#93c5fd' },
                  ].filter(s => s.text).map(section => (
                    <div key={section.label}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{section.icon}</div>
                        <span style={{ fontSize: '10.5px', fontWeight: 700, color: section.color, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{section.label}</span>
                      </div>
                      <p style={{ margin: 0, paddingLeft: '28px', color: 'rgba(255,255,255,0.68)', fontSize: '14px', lineHeight: '1.6' }}>{section.text}</p>
                    </div>
                  ))}

                  {item.example && (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Quote size={13} strokeWidth={1.5} color="#86efac" />
                        </div>
                        <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#86efac', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Example</span>
                      </div>
                      <p style={{ margin: 0, paddingLeft: '28px', color: 'rgba(255,255,255,0.58)', fontSize: '14px', lineHeight: '1.6', fontStyle: 'italic' }}>
                        "{renderExampleText(item.example)}"
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder, select::placeholder { color: rgba(255,255,255,0.3); }
        select option { background: #1e1a36; color: #fff; }
      `}</style>
    </div>
  );
}
