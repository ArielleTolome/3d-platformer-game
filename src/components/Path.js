import React from 'react';
import './Path.css';

const Path = ({ segment }) => {
  const style = {
    transform: `translate3d(0, 0, ${segment.z}px)`,
  };

  return (
    <div className="path-segment" style={style}>
      <div className="path-ground"></div>
      <div className="path-wall path-wall-left"></div>
      <div className="path-wall path-wall-right"></div>
    </div>
  );
};

export default Path;