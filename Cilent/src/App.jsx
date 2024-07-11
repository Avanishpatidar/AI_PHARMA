import React, { useState } from 'react';
import InputForm from './components/InputForm';
import GeneratedContent from './components/GeneratedContent';
import ThemeSelector from './components/ThemeSelector';
import './App.css';

const themes = {
  default: {
    bgColor: '#f9f9f9',
    fontColor: '#333',
    hlColor: '#007bff',
    fgColor: '#f9f9f9'
  },
  mkbhd: {
    bgColor: '#000',
    fontColor: '#fff',
    hlColor: '#4caf50',
    fgColor: '#333'
  },
  mocha: {
    bgColor: '#f2e6d8',
    fontColor: '#3b2925',
    hlColor: '#c19875',
    fgColor: '#f2e6d8'
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
};
function App() {
  const [generatedContent, setGeneratedContent] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState(themes.default);

  const changeTheme = (themeName) => {
    setSelectedTheme(themes[themeName]);
    document.documentElement.style.setProperty('--bg-color', themes[themeName].bgColor);
    document.documentElement.style.setProperty('--font-color', themes[themeName].fontColor);
    document.documentElement.style.setProperty('--hl-color', themes[themeName].hlColor);
    document.documentElement.style.setProperty('--fg-color', themes[themeName].fgColor);
  };

  return (
    <div className="app">
      <ThemeSelector themes={themes} changeTheme={changeTheme} />
      <div className="app-content">
        <GeneratedContent generatedContent={generatedContent} />
      </div>
      <InputForm setGeneratedContent={setGeneratedContent} />
    </div>
  );
}

export default App;