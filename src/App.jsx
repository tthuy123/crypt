import React from 'react';
import RSA from './pages/RSA.jsx';  // Import RSA component từ file RSA.jsx

const App = () => {
  return (
    <div>
      <h1>Welcome to the RSA Encryption App</h1>
      <RSA />  {/* Sử dụng component RSA */}
    </div>
  );
};

export default App;
