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
  const [activeSection, setActiveSection] = useState(0);

  if (!generatedContent || generatedContent.length === 0) return null;

  const lastAIResponse = generatedContent.filter(msg => msg.type === 'ai').pop();

  return (
    <div className="generated-content">
      {lastAIResponse && (
        <div className="ai-response">
          {formatAIResponse(lastAIResponse.content, activeSection, setActiveSection)}
        </div>
      )}
    </div>
  );
}

function formatAIResponse(content, activeSection, setActiveSection) {
  const cleanedContent = content
    .replace(/##/g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/\d+\.\s*/g, '');

  const sections = {};
  sectionTitles.forEach(title => {
    const regex = new RegExp(`${title.name}:([^]*?)(?=${sectionTitles.map(st => st.name).join('|')}|$)`, 'g');
    const match = cleanedContent.match(regex);
    if (match) {
      sections[title.name] = match[0].replace(`${title.name}:`, '').trim();
    } else {
      sections[title.name] = 'Not available';
    }
  });

  console.log("Sections Extracted:", sections); // Debugging: Log the extracted sections

  const activeSectionData = sectionTitles[activeSection];
  const sectionContent = sections[activeSectionData.name];

  return (
    <>
      <div className="section-navigation">
        {sectionTitles.map((section, index) => (
          <button
            key={index}
            className={`section-button ${index === activeSection ? 'active' : ''}`}
            onClick={() => setActiveSection(index)}
          >
            <i className={`${section.icon} section-icon`}></i>
            {section.name}
          </button>
        ))}
      </div>
      {sectionContent && sectionContent !== 'Not available' ? (
        <AnimatedCard
          title={activeSectionData.name}
          icon={activeSectionData.icon}
          content={sectionContent}
        />
      ) : (
        <div className="no-content">No content available for {activeSectionData.name}</div>
      )}
    </>
  );
}

function AnimatedCard({ title, icon, content }) {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    setIsAnimating(true);
    setDisplayedContent('');
    let timeoutId;
    const animateText = (text, index) => {
      if (index <= text.length) {
        setDisplayedContent(text.slice(0, index));
        timeoutId = setTimeout(() => animateText(text, index + 1), 10); // Speed up animation
      } else {
        setIsAnimating(false);
      }
    };

    timeoutId = setTimeout(() => animateText(content, 0), 50); // Start animation faster

    return () => clearTimeout(timeoutId);
  }, [content]);

  return (
    <div className={`card ${isAnimating ? 'animating' : ''}`}>
      <h3 className="card-title">
        <i className={`${icon} card-icon`}></i>
        {title}
      </h3>
      <p className="card-content">{displayedContent}</p>
    </div>
  );
}

export default GeneratedContent;
