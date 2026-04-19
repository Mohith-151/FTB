import React, { useState, useRef, useEffect } from 'react';
import { Handle, Position } from 'reactflow';

const CustomNode = ({ data, selected, id }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(data.name);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => setIsEditing(true);

  const handleBlur = () => {
    setIsEditing(false);
    if (name.trim()) data.onNameChange?.(id, name);
    else setName(data.name);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      inputRef.current?.blur();
    }
    if (e.key === 'Escape') {
      setName(data.name);
      setIsEditing(false);
    }
  };

  const isDeceased = data.status === 'deceased';

  return (
    <>
      <Handle type="target" position={Position.Top} id="top" style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Left} id="left" style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} id="right" style={{ opacity: 0 }} />
      
      <div 
        className={`custom-node ${isDeceased ? 'deceased' : ''}`}
        onDoubleClick={handleDoubleClick}
      >
        <div className="node-name">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="name-input"
            />
          ) : (
            <span>{data.name}</span>
          )}
        </div>

        <div className="node-details">
          {data.age && <span className="node-age">{data.age}</span>}
          {data.age && data.status && <span className="separator">•</span>}
          <span className="node-status">{data.status === 'deceased' ? 'Deceased' : 'Alive'}</span>
        </div>
      </div>
    </>
  );
};

export default CustomNode;