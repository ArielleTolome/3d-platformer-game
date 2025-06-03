import React from 'react';
import './Coin.css';

const Coin = ({ coin }) => {
  const style = {
    transform: `translate3d(${coin.x}px, 0, ${coin.z}px)`,
  };

  return (
    <div className="coin-container" style={style}>
      <div className="coin">
        <div className="coin-face coin-front"></div>
        <div className="coin-face coin-back"></div>
      </div>
    </div>
  );
};

export default Coin;