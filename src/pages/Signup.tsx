import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, BookOpen, Eye, EyeOff } from 'lucide-react';
import { api } from '../services/api';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/signup', {
        name: name.trim(), email: email.trim(), password: password.trim(),
      });
      if (response.status === 200 || response.status === 201) navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.detail || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const fieldStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
    padding: '12px 14px 12px 38px', color: '#fff',
    fontSize: '14.5px', outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s, background 0.2s',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '12.5px',
    fontWeight: 600, marginBottom: '7px', letterSpacing: '0.04em', textTransform: 'uppercase',
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'rgba(139,92,246,0.6)';
    e.target.style.background = 'rgba(255,255,255,0.09)';
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'rgba(255,255,255,0.1)';
    e.target.style.background = 'rgba(255,255,255,0.06)';
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #13111c 0%, #1e1a36 50%, #13111c 100%)',
      zIndex: 9999,
      fontFamily: "'Inter', system-ui, sans-serif",
      padding: '1rem',
      overflowY: 'auto',
    }}>
      <div style={{
        position: 'absolute', top: '-20%', right: '-15%',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', left: '-15%',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: '100%', maxWidth: '420px',
          borderRadius: '24px',
          background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
          overflow: 'hidden',
          position: 'relative', zIndex: 1,
        }}
      >
        {/* Header */}
        <div style={{
          padding: '2rem 2rem 1.75rem',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          textAlign: 'center',
        }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'rgba(139,92,246,0.2)',
            border: '1px solid rgba(139,92,246,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.25rem',
          }}>
            <BookOpen size={26} strokeWidth={1.5} color="rgba(196,181,253,1)" />
          </div>
          <h1 style={{ color: '#FFF', fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.025em', margin: 0 }}>
            Create account
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', marginTop: '6px' }}>
            Join AI Vocabulary — it's free
          </p>
        </div>

        {/* Form */}
        <div style={{ padding: '1.75rem 2rem 1.5rem' }}>
          {error && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: '12px', padding: '12px 14px', color: '#fca5a5',
                fontSize: '13.5px', marginBottom: '1.25rem',
              }}
            >{error}</motion.div>
          )}

          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Name */}
            <div>
              <label style={labelStyle}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={15} strokeWidth={1.5} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)', pointerEvents: 'none' }} />
                <input type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required
                  style={fieldStyle} onFocus={handleFocus} onBlur={handleBlur} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} strokeWidth={1.5} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)', pointerEvents: 'none' }} />
                <input type="email" placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)} required
                  style={fieldStyle} onFocus={handleFocus} onBlur={handleBlur} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} strokeWidth={1.5} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)', pointerEvents: 'none' }} />
                <input type={showPassword ? 'text' : 'password'} placeholder="Min. 8 characters" value={password} onChange={e => setPassword(e.target.value)} required
                  style={{ ...fieldStyle, paddingRight: '40px' }} onFocus={handleFocus} onBlur={handleBlur} />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)', padding: 0 }}>
                  {showPassword ? <EyeOff size={15} strokeWidth={1.5} /> : <Eye size={15} strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            {/* Confirm */}
            <div>
              <label style={labelStyle}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} strokeWidth={1.5} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)', pointerEvents: 'none' }} />
                <input type="password" placeholder="Repeat password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required
                  style={fieldStyle} onFocus={handleFocus} onBlur={handleBlur} />
              </div>
            </div>

            <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.98 }}
              style={{
                width: '100%', padding: '13px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                border: 'none', borderRadius: '12px',
                color: '#fff', fontSize: '14.5px', fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                boxShadow: '0 8px 20px rgba(99,102,241,0.35)',
                marginTop: '4px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              {loading ? (
                <>
                  <svg style={{ animation: 'spin 1s linear infinite', width: 16, height: 16 }} viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                  Creating account…
                </>
              ) : 'Create Account'}
            </motion.button>
          </form>
        </div>

        {/* Footer */}
        <div style={{
          padding: '1.1rem 2rem', textAlign: 'center',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          background: 'rgba(0,0,0,0.15)',
        }}>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13.5px' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'rgba(167,139,250,1)', fontWeight: 600, textDecoration: 'none' }}>
              Sign in →
            </Link>
          </span>
        </div>
      </motion.div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(255,255,255,0.25) !important; }
      `}</style>
    </div>
  );
}
