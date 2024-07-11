import React from 'react';
import './GeneratedContent.css';

const sectionTitles = [
  'Composition',
  'Purpose',
  'Ayurvedic Solution',
  'Homeopathy Solution',
  'Natural Ways to Heal',
  'Exercises',
  'Food to Take',
  'History',
  'Mechanism',
  'Dosage',
  'Benefits',
  'Side Effects',
  'Other Options',
  'Estimated Price in INR'
];

function GeneratedContent({ generatedContent, theme }) {
  if (!generatedContent) return null;

  // Clean up the content by removing unwanted symbols
  const cleanedContent = generatedContent
    .replace(/##/g, '')  // Remove ##
    .replace(/\*\*/g, '')  // Remove **
    .replace(/\*/g, '');  // Remove single *

  // Parse content into sections
  const sections = {};
  sectionTitles.forEach(title => {
    const regex = new RegExp(`${title}:([^]*?)(?=${sectionTitles.join('|')}|$)`, 'g');
    const match = cleanedContent.match(regex);
    if (match) {
      sections[title] = match[0].replace(`${title}:`, '').trim();
    }
  });

  // Define CSS variables based on theme
  const themeVars = {
    '--bg-color': theme.bgColor || '#f9f9f9',
    '--font-color': theme.fontColor || '#333',
    '--hl-color': theme.hlColor || '#007bff',
    '--fg-color': theme.fgColor || '#666'
  };

  return (
    <div className="generated-content" style={themeVars}>
      <h2>Generated Content:</h2>
      {sectionTitles.map((title, index) => (
        sections[title] && (
          <div key={index} className="card">
            <h3 className="card-title">{title}</h3>
            <p className="card-content">{sections[title]}</p>
          </div>
        )
      ))}
    </div>
  );
}

export default GeneratedContent;
