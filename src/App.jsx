import React, { useState } from 'react';
import PrintSizeSelector from './components/PrintSizeSelector';
import FamilyTreeCanvas from './components/FamilyTreeCanvas';
import './App.css';

function App() {
  const [selectedSize, setSelectedSize] = useState(null);

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  return (
    <div className="app">
      {!selectedSize ? (
        <PrintSizeSelector onSelect={handleSizeSelect} />
      ) : (
        <FamilyTreeCanvas paperSize={selectedSize} />
      )}
    </div>
  );
}

export default App;
