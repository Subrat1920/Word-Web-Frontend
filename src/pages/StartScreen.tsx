import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

export default function StartScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const userId = localStorage.getItem('user_id');
      setTimeout(() => {
        if (userId) {
          navigate('/home');
        } else {
          navigate('/login');
        }
      }, 2000); // 2 second mock loading for animation
    };
    checkAuth();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <motion.div
           animate={{ 
             y: [0, -15, 0],
           }}
           transition={{ 
             duration: 2, 
             repeat: Infinity,
             ease: "easeInOut"
           }}
        >
          <div className="glass-card" style={{ borderRadius: '50%', padding: '2rem' }}>
             <BookOpen size={64} className="text-primary" style={{ color: 'var(--primary)' }} />
          </div>
        </motion.div>
        
        <motion.h1 
          className="mt-8 text-3xl font-bold gradient-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          AI Vocabulary
        </motion.h1>
        
        <motion.p 
          className="mt-4 text-text-secondary font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          Loading your premium experience...
        </motion.p>
      </motion.div>
    </div>
  );
}
