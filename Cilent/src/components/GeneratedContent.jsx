import React, { useState, useEffect } from 'react';
import './GeneratedContent.css';

const sectionTitles = [
  { name: 'Composition', icon: 'fa-solid fa-flask' },
  { name: 'Purpose', icon: 'fa-solid fa-bullseye' },
  { name: 'Ayurvedic Solution', icon: 'fa-solid fa-leaf' },
  { name: 'Homeopathy Solution', icon: 'fa-solid fa-droplet' },
  { name: 'Natural Ways to Heal', icon: 'fa-solid fa-seedling' },
  { name: 'Exercises', icon: 'fa-solid fa-dumbbell' },
  { name: 'Food to Take', icon: 'fa-solid fa-utensils' },
  { name: 'History', icon: 'fa-solid fa-clock-rotate-left' },
  { name: 'Mechanism', icon: 'fa-solid fa-gears' },
  { name: 'Dosage', icon: 'fa-solid fa-pills' },
  { name: 'Benefits', icon: 'fa-solid fa-heart' },
  { name: 'Side Effects', icon: 'fa-solid fa-triangle-exclamation' },
  { name: 'Other Options', icon: 'fa-solid fa-list' },
  { name: 'Estimated Price in INR', icon: 'fa-solid fa-indian-rupee-sign' }
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
              formatAIResponse(message.content)
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function formatAIResponse(content) {
  const cleanedContent = content
    .replace(/##/g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/\d+\.\s*/g, ''); // Remove numbering

  const sections = {};
  sectionTitles.forEach(title => {
    const regex = new RegExp(`${title.name}:([^]*?)(?=${sectionTitles.map(st => st.name).join('|')}|$)`, 'g');
    const match = cleanedContent.match(regex);
    if (match) {
      sections[title.name] = match[0].replace(`${title.name}:`, '').trim();
    }
  });

  return (
    <div className="ai-response">
      {sectionTitles.map((section, index) => (
        sections[section.name] && (
          <AnimatedCard 
            key={index}
            title={section.name}
            icon={section.icon}
            content={sections[section.name]}
            delay={index * 100}
          />
        )
      ))}
    </div>
  );
}

function AnimatedCard({ title, icon, content, delay }) {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    let timeoutId;
    const animateText = (text, index) => {
      if (index <= text.length) {
        setDisplayedContent(text.slice(0, index));
        timeoutId = setTimeout(() => animateText(text, index + 1), 20);
      } else {
        setIsAnimating(false);
      }
    };

    if (isAnimating) {
      timeoutId = setTimeout(() => animateText(content, 0), delay);
    }

    return () => clearTimeout(timeoutId);
  }, [content, delay, isAnimating]);

  return (
    <div 
      className={`card animate-in ${isAnimating ? 'animating' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <h3 className="card-title">
        <i className={`${icon} card-icon`}></i>
        {title}
      </h3>
      <p className="card-content">{displayedContent}</p>
    </div>
  );
}

export default GeneratedContent;
