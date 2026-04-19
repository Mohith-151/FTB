import React, { useState, useEffect } from 'react';

const DataModal = ({ isOpen, relationType, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    status: 'alive',
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({ name: '', age: '', status: 'alive' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getModalTitle = () => {
    const titles = {
      parent: 'Add Parent',
      spouse: 'Add Spouse',
      sibling: 'Add Sibling',
      child: 'Add Child',
    };
    return titles[relationType] || 'Add Family Member';
  };

  return (
    <div className="modal-overlay no-print" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{getModalTitle()}</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter full name"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="age">Age / Birth Year</label>
            <input
              id="age"
              type="text"
              value={formData.age}
              onChange={(e) => handleChange('age', e.target.value)}
              placeholder="e.g., 45 or 1979"
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <div className="status-toggle">
              <button
                type="button"
                className={`status-option ${formData.status === 'alive' ? 'active' : ''}`}
                onClick={() => handleChange('status', 'alive')}
              >
                Alive
              </button>
              <button
                type="button"
                className={`status-option ${formData.status === 'deceased' ? 'active' : ''}`}
                onClick={() => handleChange('status', 'deceased')}
              >
                Deceased
              </button>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Add to Tree
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DataModal;
