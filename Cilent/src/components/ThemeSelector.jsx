import React, { useState } from 'react';
import './ThemeSelector.css';

function ThemeSelector({ themes, changeTheme }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleThemeChange = (themeName) => {
    changeTheme(themeName);
    setIsOpen(false);
  };

  return (
    <div className="theme-selector">
      <button onClick={toggleDropdown} className="theme-selector-button">
        Select Theme
      </button>
      {isOpen && (
        <div className="theme-dropdown">
          {Object.entries(themes).map(([themeName, themeColors]) => (
            <div
              key={themeName}
              className="theme-option"
              onClick={() => handleThemeChange(themeName)}
            >
              <span>{themeName}</span>
              <div className="color-preview">
                <div style={{ backgroundColor: themeColors.bgColor }}></div>
                <div style={{ backgroundColor: themeColors.fontColor }}></div>
                <div style={{ backgroundColor: themeColors.hlColor }}></div>
                <div style={{ backgroundColor: themeColors.fgColor }}></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ThemeSelector;