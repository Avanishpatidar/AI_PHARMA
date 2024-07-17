import React, { useState } from 'react';
import './InputForm.css';
import Loader from './Loader';

function InputForm({ setGeneratedContent }) {
  const [medicineName, setMedicineName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!medicineName.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`https://ai-pharma-dfcp.vercel.app/generate?medicineName=${medicineName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ medicineName }),
      });
      const data = await response.json();
      setGeneratedContent(prevContent => [...prevContent, { type: 'human', content: medicineName }, { type: 'ai', content: data.content }]);
      setMedicineName('');
    } catch (error) {
      console.error('Error fetching generated content:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="input-form-container">
        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            value={medicineName}
            onChange={(e) => setMedicineName(e.target.value)}
            placeholder="Enter a medicine name..."
            className="input-field"
            disabled={loading}
          />
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Generating...' : 'Send'}
          </button>
        </form>
      </div>
      <Loader loading={loading} />
    </>
  );
}

export default InputForm;