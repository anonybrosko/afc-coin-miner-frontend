import React, { useContext } from "react";
import { GameContext } from "./GameContext";

export default function Mine() {
  const { mineCoin, clicks } = useContext(GameContext);

  return (
    <div>
      <h1>Mine AFC Coin</h1>
      <p>Clicks: {clicks}</p>
      <button
        onClick={mineCoin}
        style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
      >
        Mine
      </button>
    </div>
  );
}
