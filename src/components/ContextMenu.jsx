import React, { useEffect, useRef } from 'react';
import { RELATION_TYPES } from '../utils/constants';

const ContextMenu = ({ position, onSelect, onClose }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const menuItems = [
    { label: 'Add Parent', type: RELATION_TYPES.PARENT, icon: '↑' },
    { label: 'Add Spouse', type: RELATION_TYPES.SPOUSE, icon: '♥' },
    { label: 'Add Sibling', type: RELATION_TYPES.SIBLING, icon: '↔' },
    { label: 'Add Child', type: RELATION_TYPES.CHILD, icon: '↓' },
  ];

  return (
    <div 
      ref={menuRef}
      className="context-menu no-print"
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {menuItems.map((item) => (
        <button
          key={item.type}
          className="context-menu-item"
          onClick={() => onSelect(item.type)}
        >
          <span className="menu-icon">{item.icon}</span>
          <span className="menu-label">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ContextMenu;
