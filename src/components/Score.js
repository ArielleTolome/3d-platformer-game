import React from 'react';
import './Score.css';

const Score = ({ score, coins }) => {
  return (
    <div className="score-container">
      <div className="score-item">
        <span className="score-label">SCORE</span>
        <span className="score-value">{score}</span>
      </div>
      <div className="score-item">
        <span className="coin-icon">💰</span>
        <span className="score-value">{coins}</span>
      </div>
    </div>
  );
};

export default Score;