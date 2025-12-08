import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

export const MultiSelectDropdown = ({ label, options, selected = [], onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option) => {
    const newSelection = selected.includes(option)
      ? selected.filter(item => item !== option)
      : [...selected, option];
    onChange(newSelection);
  };

  return (
    <div className="filter-dropdown-container" ref={ref}>
      <button 
        className={`filter-btn ${selected.length > 0 ? 'active' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        {label} {selected.length > 0 && `(${selected.length})`} <ChevronDown size={14} />
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          {options.map(option => (
            <label key={option} className="dropdown-item">
              <input 
                type="checkbox" 
                checked={selected.includes(option)}
                onChange={() => toggleOption(option)}
              />
              <span>{option}</span>
            </label>
          ))}
          {selected.length > 0 && (
            <button 
                className="clear-filter-text"
                onClick={() => onChange([])}
            >
                Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// Dropdown (Age)
export const RangeDropdown = ({ label, min, max, onApply }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localMin, setLocalMin] = useState(min || '');
  const [localMax, setLocalMax] = useState(max || '');
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleApply = () => {
      onApply(localMin, localMax);
      setIsOpen(false);
  };

  const isActive = min || max;

  return (
    <div className="filter-dropdown-container" ref={ref}>
       <button 
        className={`filter-btn ${isActive ? 'active' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        {label} {isActive ? '*' : ''} <ChevronDown size={14} />
      </button>

      {isOpen && (
          <div className="dropdown-menu range-menu">
              <div className="range-inputs">
                  <input 
                    type="number" 
                    placeholder="Min" 
                    value={localMin}
                    onChange={(e) => setLocalMin(e.target.value)}
                  />
                  <span>-</span>
                  <input 
                    type="number" 
                    placeholder="Max" 
                    value={localMax}
                    onChange={(e) => setLocalMax(e.target.value)}
                  />
              </div>
              <button className="apply-btn" onClick={handleApply}>Apply</button>
              {isActive && (
                  <button 
                    className="clear-filter-text" 
                    onClick={() => { setLocalMin(''); setLocalMax(''); onApply('', ''); }}
                  >
                      Clear
                  </button>
              )}
          </div>
      )}
    </div>
  );
};