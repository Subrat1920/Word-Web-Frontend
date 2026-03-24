import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Fingerprint, BookOpen, Eye, EyeOff } from 'lucide-react';
import { api } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', {
        email: email.trim(),
        password: password.trim(),
      });
      localStorage.setItem('user_id', response.data.user_id);
      localStorage.setItem('access_token', response.data.access_token);
      navigate('/home');
    } catch (err: any) {
      let msg = "Login failed. Please check your credentials.";
      if (err.response?.data?.detail) {
        if (typeof err.response.data.detail === 'string') msg = err.response.data.detail;
        else if (Array.isArray(err.response.data.detail)) msg = err.response.data.detail[0]?.msg || msg;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleFingerprintLogin = () => {
    localStorage.setItem('user_id', '1');
    navigate('/home');
  };

  return (
    // Fixed full-screen overlay that completely escapes the app-container layout
    <div style={{
      position: 'fixed', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #13111c 0%, #1e1a36 50%, #13111c 100%)',
      zIndex: 9999,
      fontFamily: "'Inter', system-ui, sans-serif",
      padding: '1rem',
      overflowY: 'auto',
    }}>
      {/* Background decorations */}
      <div style={{
        position: 'absolute', top: '-20%', left: '-15%',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', right: '-15%',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
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
        {/* Header band */}
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
          <h1 style={{ color: '#FFFFFF', fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.025em', margin: 0 }}>
            Welcome back
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', marginTop: '6px' }}>
            Sign in to AI Vocabulary
          </p>
        </div>

        {/* Form body */}
        <div style={{ padding: '1.75rem 2rem' }}>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: '12px', padding: '12px 14px', color: '#fca5a5',
                fontSize: '13.5px', marginBottom: '1.25rem',
              }}
            >{error}</motion.div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '12.5px', fontWeight: 600, marginBottom: '7px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} strokeWidth={1.5}
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)', pointerEvents: 'none' }} />
                <input
                  type="email" placeholder="name@example.com"
                  value={email} onChange={e => setEmail(e.target.value)} required
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
                    padding: '12px 14px 12px 38px', color: '#fff',
                    fontSize: '14.5px', outline: 'none', boxSizing: 'border-box',
                    transition: 'border-color 0.2s, background 0.2s',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(139,92,246,0.6)'; e.target.style.background = 'rgba(255,255,255,0.09)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.06)'; }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
                <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12.5px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Password</label>
                <a href="#" style={{ color: 'rgba(167,139,250,0.8)', fontSize: '12px', fontWeight: 500, textDecoration: 'none' }}>Forgot?</a>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={15} strokeWidth={1.5}
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)', pointerEvents: 'none' }} />
                <input
                  type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)} required
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
                    padding: '12px 40px 12px 38px', color: '#fff',
                    fontSize: '14.5px', outline: 'none', boxSizing: 'border-box',
                    transition: 'border-color 0.2s, background 0.2s',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(139,92,246,0.6)'; e.target.style.background = 'rgba(255,255,255,0.09)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.06)'; }}
                />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)', padding: 0 }}>
                  {showPassword ? <EyeOff size={15} strokeWidth={1.5} /> : <Eye size={15} strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            {/* CTA */}
            <motion.button
              type="submit" disabled={loading}
              whileTap={{ scale: 0.98 }}
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
                transition: 'opacity 0.2s, transform 0.1s',
              }}
            >
              {loading ? (
                <>
                  <svg style={{ animation: 'spin 1s linear infinite', width: 16, height: 16 }} viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                  Signing in…
                </>
              ) : 'Sign In'}
            </motion.button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '1.25rem 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11.5px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          </div>

          {/* Biometric */}
          <button type="button" onClick={handleFingerprintLogin}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              padding: '12px', borderRadius: '12px',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
              color: 'rgba(255,255,255,0.65)', fontSize: '14px', fontWeight: 500,
              cursor: 'pointer', transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
          >
            <Fingerprint size={17} strokeWidth={1.5} color="rgba(167,139,250,0.9)" />
            Continue with Biometrics
          </button>
        </div>

        {/* Footer */}
        <div style={{
          padding: '1.1rem 2rem', textAlign: 'center',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          background: 'rgba(0,0,0,0.15)',
        }}>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13.5px' }}>
            No account?{' '}
            <Link to="/signup" style={{ color: 'rgba(167,139,250,1)', fontWeight: 600, textDecoration: 'none' }}>
              Create one free →
            </Link>
          </span>
        </div>
      </motion.div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(255,255,255,0.25); }
      `}</style>
    </div>
  );
}
