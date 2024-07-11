import React, { useState } from 'react';
import Loader from './Loader';
import './InputForm.css';

function InputForm({ setGeneratedContent }) {
  const [medicineName, setMedicineName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      setGeneratedContent(data.content);
    } catch (error) {
      console.error('Error fetching generated content:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="input-form-container">
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={medicineName}
          onChange={(e) => setMedicineName(e.target.value)}
          placeholder="Enter medicine name"
          className="input-field"
        />
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? <Loader loading={loading} /> : 'Generate'}
        </button>
      </form>
    </div>
  );
}

export default InputForm;