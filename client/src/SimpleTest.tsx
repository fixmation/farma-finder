import React from 'react';

const SimpleTest = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>DigiFarmacy - Test Loading</h1>
      <p>If you can see this, React is working!</p>
      <button onClick={() => alert('Button works!')}>Test Button</button>
    </div>
  );
};

export default SimpleTest;