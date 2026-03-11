import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import { GameContext } from "./GameContext";
import Home from "./Home";
import Mine from "./Mine";
import Upgrades from "./Upgrades";
import Prestige from "./Prestige"
import './App.css';

function Header(){
  const { balance, isMobile } = useContext(GameContext);
  return (
  <div>
      <nav className={`navbar ${isMobile ? "mobile" : "desktop"}`}>
        <Link to="/">Home</Link>
        <Link to="/mine">Mine</Link>
        <Link to="/upgrades">Upgrades</Link>
        <Link to="/prestige">Prestige</Link>
      </nav>
      <div className="balance-display">Balance: {balance} AFC</div>
    </div>
  );
}

function App() {
  const { isMobile } = useContext(GameContext);
  return (
    <Router>
      <div className={`container ${isMobile ? "mobile" : "desktop"}`}>
        <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mine" element={<Mine />} />
            <Route path="/upgrades" element={<Upgrades />} />
            <Route path="/prestige" element={<Prestige />} />
          </Routes>
        </div>
    </Router>
  );
}

export default App;
