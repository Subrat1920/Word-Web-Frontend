import axios from 'axios';

// In development: Vite proxy maps /api/v1 → backend (see vite.config.ts)
// In production:  set VITE_API_URL in your hosting dashboard (Vercel / Render / Railway)
//                 e.g. VITE_API_URL=https://your-backend.onrender.com/api/v1
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
