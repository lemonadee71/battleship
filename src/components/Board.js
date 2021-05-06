import React from 'react';
import { uuid } from '../utils';

const Board = ({ type, size, board, myTurn, gameStart, clickHandler }) => {
  const determineCellClass = (cell) => {
    switch (cell) {
      case 'HIT':
        return ' hit';
      case 'MISS':
        return ' missed';
      case undefined:
        return ' occupied';
      case null:
        return '';
      default:
        return type === 'human' ? ' ship' : '';
    }
  };

  const cellClickHandler = (e) => {
    if (myTurn) return;

    const pos = e.target.getAttribute('data-pos').split('-');
    clickHandler(...pos);
  };

  return (
    <div id="grid" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
      {board
        .map((row, i) =>
          row.map((cell, j) => (
            <div
              data-pos={`${i}-${j}`}
              key={uuid(10)}
              className={`cell${determineCellClass(cell)}`}
              onClick={cellClickHandler}
            ></div>
          ))
        )
        .flat()}
    </div>
  );
};

export default Board;
