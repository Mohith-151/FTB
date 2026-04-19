import React from 'react';
import { PAPER_SIZES } from '../utils/constants';

const PrintSizeSelector = ({ onSelect }) => {
  return (
    <div className="size-selector-overlay">
      <div className="size-selector-modal">
        <h2>Select Print Size</h2>
        <p className="subtitle">Choose the paper format for your family tree</p>
        
        <div className="size-grid">
          {Object.entries(PAPER_SIZES).map(([key, size]) => (
            <button
              key={key}
              className="size-option"
              onClick={() => onSelect(key)}
            >
              <div className="paper-icon">
                <div 
                  className="paper-preview"
                  style={{
                    aspectRatio: `${size.width} / ${size.height}`
                  }}
                />
              </div>
              <span className="size-label">{size.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrintSizeSelector;
