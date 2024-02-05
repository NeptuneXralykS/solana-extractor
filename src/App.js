import React from 'react';
import './App.css'; // Ensure you have an App.css for your App-specific styles
import SolanaTransactionComponent from './SolanaTransactionComponent'; // Adjust the import path as necessary

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Solana Transaction App</h1>
        <p>Interact with the Solana blockchain easily.</p>
      </header>
      <main>
        <SolanaTransactionComponent />
      </main>
      <footer>
        <p>© 2023 Your Name or Company. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
