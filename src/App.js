import React, { useEffect, useState } from 'react';
import Gameboard from './modules/Gameboard';
import AI from './modules/Player';
import Ship from './modules/Ship';
import ships from './ships.json';
import difficulty from './difficulty.json';
import Board from './components/Board';

const App = () => {
  let size = difficulty.hard.size;
  const board = Gameboard(size);
  const [playerBoard, setPlayerBoard] = useState(board.getBoard());

  useEffect(() => {
    const placeShip = ({ name, pos, direction }) => {
      const shipDetails = ships[name];
      const ship = new Ship(shipDetails.name, shipDetails.length);

      try {
        return board.placeShip({ ship, pos, direction });
      } catch (error) {
        // console.log(error.toString());
        return false;
      }
    };

    const ai = new AI(size);
    const allShips = difficulty.hard.ships;
    let currentShip = null;

    while (allShips.length) {
      currentShip = allShips.shift();

      let currentCount = currentShip.number;
      while (currentCount) {
        let move = ai.placeShipInRandom();

        if (placeShip({ name: currentShip.name, ...move })) {
          setPlayerBoard(board.getBoard());
          currentCount -= 1;
        }
      }
    }

    console.table(board.getBoard());
  }, [size, board]);

  return (
    <div className="App">
      <h1>Battleship</h1>
      <Board size={size} board={playerBoard} />
    </div>
  );
};

export default App;
