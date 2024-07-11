import React, { useState, useEffect } from 'react';
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

function GeneratedContent({ generatedContent }) {
  if (!generatedContent || generatedContent.length === 0) return null;

  return (
    <div className="generated-content">
      {generatedContent.map((message, index) => (
        <div key={index} className={`message ${message.type}`}>
          <div className="message-content">
            {message.type === 'human' ? (
              <p>{message.content}</p>
            ) : (
              formatAIResponse(message.content, index)
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function formatAIResponse(content, messageIndex) {
  // Clean up the content by removing unwanted symbols
  const cleanedContent = content
    .replace(/##/g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '');

  // Parse content into sections
  const sections = {};
  sectionTitles.forEach(title => {
    const regex = new RegExp(`${title}:([^]*?)(?=${sectionTitles.join('|')}|$)`, 'g');
    const match = cleanedContent.match(regex);
    if (match) {
      sections[title] = match[0].replace(`${title}:`, '').trim();
    }
  });

  return (
    <div className="ai-response">
      {sectionTitles.map((title, index) => (
        sections[title] && (
          <AnimatedCard 
            key={index}
            title={title}
            content={sections[title]}
            delay={index * 100}
          />
        )
      ))}
    </div>
  );
}

function AnimatedCard({ title, content, delay }) {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    let timeoutId;
    if (isAnimating) {
      const animateText = (text, index) => {
        if (index <= text.length) {
          setDisplayedContent(text.slice(0, index));
          timeoutId = setTimeout(() => animateText(text, index + 1), 20);
        } else {
          setIsAnimating(false);
        }
      };

      timeoutId = setTimeout(() => animateText(content, 0), delay);
    }

    return () => clearTimeout(timeoutId);
  }, [content, delay, isAnimating]);

  return (
    <div 
      className={`card animate-in ${isAnimating ? 'animating' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <h3 className="card-title">{title}</h3>
      <p className="card-content">{displayedContent}</p>
    </div>
  );
}

export default GeneratedContent;