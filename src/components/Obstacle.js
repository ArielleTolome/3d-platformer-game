import React from 'react';
import './Obstacle.css';

const Obstacle = ({ obstacle }) => {
  const style = {
    transform: `translate3d(${obstacle.x}px, 0, ${obstacle.z}px)`,
  };

  return (
    <div className={`obstacle obstacle-${obstacle.type}`} style={style}>
      {obstacle.type === 'block' && (
        <div className="obstacle-block"></div>
      )}
      {obstacle.type === 'slide' && (
        <div className="obstacle-slide"></div>
      )}
    </div>
  );
};

export default Obstacle;