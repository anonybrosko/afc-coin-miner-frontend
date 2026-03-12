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
        <button
          onClick={() =>  window.location.href = "https://www.buymeacoffee.com/bbrown9627l"}
          className="btn"
        >
          Buy me a coffee ☕
        </button>
        <button
          onClick={() => window.location.href = "https://paypal.me/techbrown24"}
          className="btn"
        >
          PayPal 💰
        </button>
      </div>
  );
};

export default Support;
