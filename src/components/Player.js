import React from 'react';
import './Player.css';

const Player = ({ position, lane }) => {
  const style = {
    transform: `translate3d(${position.x}px, ${-position.y}px, ${position.z}px)`,
  };

  return (
    <div className="player-container" style={style}>
      <div className="player">
        <div className="player-head"></div>
        <div className="player-body"></div>
        <div className="player-arm player-arm-left"></div>
        <div className="player-arm player-arm-right"></div>
        <div className="player-leg player-leg-left"></div>
        <div className="player-leg player-leg-right"></div>
      </div>
    </div>
  );
};

export default Player;