// src/components/Suggestions.jsx
import React, { useState } from 'react';
import './Suggestions.css';

const commonMedicines = [
  "Paracetamol",
  "Ibuprofen",
  "Aspirin",
  "Amoxicillin",
  "Omeprazole"
];

function Suggestions({ onSuggestionClick }) {
  const [loadingSuggestion, setLoadingSuggestion] = useState(null);

  const handleSubmit = async (medicine) => {
    setLoadingSuggestion(medicine);
    try {
      const response = await fetch(`https://ai-pharma-dfcp.vercel.app/generate?medicineName=${medicine}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ medicineName: medicine }),
      });
      const data = await response.json();
      onSuggestionClick([{ type: 'human', content: medicine }, { type: 'ai', content: data.content }]);
    } catch (error) {
      console.error('Error fetching generated content:', error);
    } finally {
      setLoadingSuggestion(null);
    }
  };

  return (
    <div className="suggestions">
      {commonMedicines.map((medicine, index) => (
        <button
          key={index}
          onClick={() => handleSubmit(medicine)}
          className="suggestion-button"
          disabled={loadingSuggestion === medicine}
        >
          {medicine}
          {loadingSuggestion === medicine && <div className="loader"></div>}
        </button>
      ))}
    </div>
  );
}

export default Suggestions;