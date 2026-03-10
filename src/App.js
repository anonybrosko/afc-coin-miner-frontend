import React, { useState } from 'react';

function App() {
  const [balance, setBalance] = useState(0);
  const [clicks, setClicks] = useState(0);

  const mineCoin = async () => {
    // Simulate mining reward
    const reward = Math.floor(Math.random() * 5) + 1;
    setBalance(prev => prev + reward);
    setClicks(prev => prev + 1);

    try {
      const response = await fetch("https://afc-coin-miner-backend.onrender.com/mine");
      const data = await response.json();
      setBalance(data.balance);
      setClicks(data.clicks);
    } catch (err){
      console.error("Backend unreachable", err);
    }
  };

  return (
    <div className="container">
      <h1>AFC Coin Miner</h1>
      <p>Balance: {balance} AFC</p>
      <p>Clicks: {clicks}</p>
      <button onClick={mineCoin}>Mine AFC Coin</button>
    </div>
  );
}

export default App;
