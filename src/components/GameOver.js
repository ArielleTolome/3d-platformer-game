import React from 'react';
import './GameOver.css';

const GameOver = ({ score, coins, onRestart }) => {
  return (
    <div className="game-over-overlay">
      <div className="game-over-modal">
        <h1 className="game-over-title">GAME OVER</h1>
        <div className="game-over-stats">
          <div className="stat-item">
            <span className="stat-label">Final Score</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Coins Collected</span>
            <span className="stat-value">{coins}</span>
          </div>
        </div>
        <button className="restart-button" onClick={onRestart}>
          PLAY AGAIN
        </button>
      </div>
    </div>
  );
};

export default GameOver;