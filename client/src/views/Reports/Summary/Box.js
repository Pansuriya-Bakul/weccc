// Box.js
import React from 'react';
import './Box.css';

const Box = ({ angle, score, category }) => {
  const boxStyle = {
    transform: `rotate(${angle}deg) translate(150px) rotate(-${angle}deg)`,
  };

  return (
    <div className="box" style={boxStyle}>
      {category}: {score}
    </div>
  );
};

export default Box;
