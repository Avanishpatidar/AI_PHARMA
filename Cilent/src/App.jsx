import React, { useState } from 'react';
import InputForm from './components/InputForm';
import GeneratedContent from './components/GeneratedContent';
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
  }
};

function App() {
  const [generatedContent, setGeneratedContent] = useState('');
  const [selectedTheme, setSelectedTheme] = useState(themes.default);

  const toggleTheme = (themeName) => {
    setSelectedTheme(themes[themeName]);
    document.documentElement.className = `theme-${themeName}`; // Apply theme-specific class to <html>
  };

  return (
    <div className="app">
      <div className="theme-toggle">
        {Object.keys(themes).map((themeName, index) => (
          <button key={index} onClick={() => toggleTheme(themeName)}>
            {themeName}
          </button>
        ))}
      </div>
      <div className="app-content" style={{ backgroundColor: selectedTheme.bgColor, color: selectedTheme.fontColor }}>
        <InputForm setGeneratedContent={setGeneratedContent} />
        <GeneratedContent generatedContent={generatedContent} theme={selectedTheme} />
      </div>
    </div>
  );
}

export default App;
