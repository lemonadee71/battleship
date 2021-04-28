import React from 'react';
import { uuid } from '../utils';

const Board = ({ size, board }) => {
  const determineCellClass = (cell) => {
    switch (cell) {
      case 'HIT':
        return ' hit';
      case 'MISS':
        return ' miss';
      case undefined:
        return ' occupied';
      case null:
        return '';
      default:
        return ' ship';
    }
  };

  return (
    <div id="grid" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
      {board
        .map((row) =>
          row.map((cell) => (
            <div
              key={uuid()}
              className={`cell${determineCellClass(cell)}`}
            ></div>
          ))
        )
        .flat()}
    </div>
  );
};

export default Board;
