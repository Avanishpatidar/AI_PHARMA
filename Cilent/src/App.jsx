import React, { useState } from 'react';
import InputForm from './components/InputForm';
import GeneratedContent from './components/GeneratedContent';

function App() {
  const [generatedContent, setGeneratedContent] = useState('');

  return (
    <div>
      <InputForm setGeneratedContent={setGeneratedContent} />
      <GeneratedContent generatedContent={generatedContent} />
    </div>
  );
}

export default App;
