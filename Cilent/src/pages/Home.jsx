import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import InputForm from '../components/InputForm';
import GeneratedContent from '../components/GeneratedContent';
import ThemeSelector from '../components/ThemeSelector';
import Suggestions from '../components/Suggestions';
import Sidebar from '../components/Sidebar';

const themes = {
  default: {
    bgColor: '#f2e6d8',
    fontColor: '#3b2925',
    hlColor: '#c19875',
    fgColor: '#f2e6d8'
  },
  mkbhd: {
    bgColor: '#000',
    fontColor: '#fff',
    hlColor: '#4caf50',
    fgColor: '#333'
  },
  coral: {
    bgColor: '#f07866',
    fontColor: '#fff',
    hlColor: '#fc5a50',
    fgColor: '#f5cac3'
  },
  ocean: {
    bgColor: '#007bff',
    fontColor: '#fff',
    hlColor: '#64a6ff',
    fgColor: '#00203f'
  },
  azure: {
    bgColor: '#f0faff',
    fontColor: '#333',
    hlColor: '#1a73e8',
    fgColor: '#d7e8fa'
  },
  forest: {
    bgColor: '#005108',
    fontColor: '#fff',
    hlColor: '#68b35d',
    fgColor: '#003c09'
  },
  'rose-milk': {
    bgColor: '#fce4ec',
    fontColor: '#333',
    hlColor: '#f48fb1',
    fgColor: '#fff0f6'
  },
  celestial: {
    bgColor: '#1a1a2e',
    fontColor: '#e94560',
    hlColor: '#6f4a8e',
    fgColor: '#16213e'
  },
  serenity: {
    bgColor: '#d6e4f0',
    fontColor: '#364f6b',
    hlColor: '#f6b352',
    fgColor: '#f9f9f9'
  },
  mystic: {
    bgColor: '#2c3e50',
    fontColor: '#c0392b',
    hlColor: '#2980b9',
    fgColor: '#34495e'
  },
  aurora: {
    bgColor: '#2c3e50',
    fontColor: '#f39c12',
    hlColor: '#3498db',
    fgColor: '#2980b9'
  },
  tranquility: {
    bgColor: '#fefae0',
    fontColor: '#7e5a2f',
    hlColor: '#c9cba3',
    fgColor: '#d6d6c2'
  }
  // other themes...
};



const Home = () => {
  const [generatedContent, setGeneratedContent] = useState([]);
  const [savedContent, setSavedContent] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedSidebarItem, setSelectedSidebarItem] = useState(null);
  const [currentInput, setCurrentInput] = useState('');

  const fetchSavedContent = async () => {
    if (user) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://ai-pharma-dfcp.vercel.app/savedContent', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setSavedContent(response.data.sort((a, b) => new Date(b.date) - new Date(a.date)));
      } catch (error) {
        console.error('Error fetching saved content:', error);
      }
    }
  };

  useEffect(() => {
    fetchSavedContent();
  }, [user]);

  const changeTheme = (themeName) => {
    setSelectedTheme(themeName);
    const theme = themes[themeName];
    document.documentElement.style.setProperty('--bg-color', theme.bgColor);
    document.documentElement.style.setProperty('--font-color', theme.fontColor);
    document.documentElement.style.setProperty('--hl-color', theme.hlColor);
    document.documentElement.style.setProperty('--fg-color', theme.fgColor);
  };

  const handleGenerateContent = async (content) => {
    try {
      setCurrentInput(content);
      const response = await axios.post(
        'https://ai-pharma-dfcp.vercel.app/generate',
        { medicineName: content }
      );
      const generatedContent = response.data.content;

      const newContent = [
        { type: 'ai', content: generatedContent, medicineName: content }
      ];

      setGeneratedContent(newContent);
      setShowSuggestions(false);
      setSelectedSidebarItem(null);

      if (user) {
        const token = localStorage.getItem('token');
        if (token) {
          await axios.post(
            'https://ai-pharma-dfcp.vercel.app/generate/save',
            { medicineName: content, content: generatedContent },
            { headers: { 'Authorization': `Bearer ${token}` } }
          );
          fetchSavedContent();
        }
      }
    } catch (error) {
      console.error('Error generating or saving content:', error);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarItemClick = (item) => {
    setSelectedSidebarItem(item);
    setCurrentInput(item.medicineName);
    setGeneratedContent([
      { type: 'ai', content: item.content, medicineName: item.medicineName }
    ]);
    setShowSuggestions(false);
  };

  return (
    <div className="app">
      <Sidebar
        savedContent={savedContent}
        user={user}
        onLogout={logout}
        onLoginClick={() => navigate('/login')}
        onSignUpClick={() => navigate('/signup')}
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        onItemClick={handleSidebarItemClick}
        selectedItem={selectedSidebarItem}
      />
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          ☰
        </button>
        <ThemeSelector themes={themes} changeTheme={changeTheme} />
        <div className="app-content">
          {showSuggestions && (
            <div className="welcome-container">
              <h1>Welcome to AI Pharma</h1>
              <p>Choose a medicine or search for one below:</p>
            </div>
          )}
          {currentInput && (
            <div className="current-input">
              <h2>Current Input: {currentInput}</h2>
            </div>
          )}
          <GeneratedContent generatedContent={generatedContent} />
          {showSuggestions && <Suggestions onSuggestionClick={handleGenerateContent} />}
          <InputForm setGeneratedContent={handleGenerateContent} />
        </div>
      </div>
    </div>
  );
};

export default Home;