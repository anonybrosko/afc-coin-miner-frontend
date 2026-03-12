import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";

import { GameProvider } from "./GameProvider";
import { GameContext } from  "./GameContext";

import Home from "./Home";
import Mine from "./Mine";
import Upgrades from "./Upgrades";
import Prestige from "./Prestige"

import './App.css';

function Header(){
  const { balance, isMobile } = useContext(GameContext);

  return (
    <header className="app-header">
      <nav className={`navbar ${isMobile ? "mobile" : "desktop"}`}>
        <Link to="/">Home</Link>
        <Link to="/mine">Mine</Link>
        <Link to="/upgrades">Upgrades</Link>
        <Link to="/prestige">Prestige</Link>
      </nav>
      <div className="balance-display-inline">Balance: {balance.toFixed(7)} AFC</div>
    </header>
  );
}

function App() {
  const { isMobile } = useContext(GameContext);
  
  return (
    <Router>
      <div className={`container ${isMobile ? "mobile" : "desktop"}`}>
        <Header />
        <main className="page-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mine" element={<Mine />} />
            <Route path="/upgrades" element={<Upgrades />} />
            <Route path="/prestige" element={<Prestige />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
