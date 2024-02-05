import React from 'react';
import './App.css';
import SolanaTransactionComponent from './SolanaTransactionComponent'; // Ensure this path matches your file structure
import backgroundImage from './background.jpg'; // Adjust the path as needed

function App() {
  return (
    <div className="App" style={{ backgroundImage: `url(${backgroundImage})` }}>
      {/* Your app content */}
      <div className="error">Error message area</div>
    </div>
  );
}

export default App;
