import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import { GameContext } from "./GameContext";
import Home from "./Home";
import Mine from "./Mine";
import Upgrades from "./Upgrades";
import Prestige from "./Prestige"

function Header(){
  const { balance } = useContext(GameContext);
  return (
  <div>
      <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/mine">Mine</Link>
        <Link to="/upgrades">Upgrades</Link>
        <Link to="/prestige">Prestige</Link>
      </nav>
      <div>Balance: {balance} AFC</div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mine" element={<Mine />} />
          <Route path="/upgrades" element={<Upgrades />} />
          <Route path="/prestige" element={<Prestige />} />
        </Routes>
    </Router>
  );
}

export default App;
