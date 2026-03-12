// Support.js
import React from "react";

const Support = () => {
  return (
    <div className="container">
      <h1>Support AFC Coin Miner</h1>
      <p>
        If you enjoy the game and want to support development, consider donating!
      </p>

      {/* Example buttons for donations */}
      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <a
          href="https://www.buymeacoffee.com/yourusername"
          target="_blank"
          rel="noopener noreferrer"
          className="btn"
        >
          Buy me a coffee ☕
        </a>
        <a
          href="https://paypal.me/yourusername"
          target="_blank"
          rel="noopener noreferrer"
          className="btn"
        >
          PayPal 💰
        </a>
      </div>
    </div>
  );
};

export default Support;
