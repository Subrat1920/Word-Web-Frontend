import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StartScreen from './pages/StartScreen';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import WordList from './pages/WordList';
import Chat from './pages/Chat';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<StartScreen />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/words" element={<WordList />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
