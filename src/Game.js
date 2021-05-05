import React, { useState, useEffect } from 'react';
import difficulty from './difficulty.json';
import ships from './ships.json';
import Gameboard from './modules/Gameboard';
import Ship from './modules/Ship';
import AI from './modules/Player';
import Board from './components/Board';

const Game = ({ mode }) => {
  const [isGameStart, setIsGameStart] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [size, setSize] = useState(difficulty[mode].size);

  const createBoard = () =>
    [...new Array(size).fill([])].map(() => [...new Array(size).fill(null)]);

  const [player, setPlayer] = useState({
    type: 'human',
    board: Gameboard(size),
  });
  const [enemy, setEnemy] = useState({
    main: new AI(),
    type: 'computer',
    board: Gameboard(size),
  });
  const [playerBoard, setPlayerBoard] = useState(createBoard());
  const [enemyBoard, setEnemyBoard] = useState(createBoard());

  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

  useEffect(() => {
    setSize(difficulty[mode].size);
    setPlayer({
      type: 'human',
      board: Gameboard(difficulty[mode].size),
    });
    setEnemy({
      main: new AI(),
      type: 'computer',
      board: Gameboard(difficulty[mode].size),
    });
    setPlayerBoard(
      [...new Array(size).fill([])].map(() => [...new Array(size).fill(null)])
    );
    setEnemyBoard(
      [...new Array(size).fill([])].map(() => [...new Array(size).fill(null)])
    );
    setIsGameStart(false);
    setIsGameOver(false);
    setIsPlayerTurn(true);

    placeShipsInRandom(false);
  }, [size, mode, isGameOver]);

  const placeShip = ({ board, name, pos, direction }) => {
    const shipDetails = ships[name];
    const ship = new Ship(shipDetails.name, shipDetails.length);

    try {
      return board.placeShip({ ship, pos, direction });
    } catch (error) {
      return false;
    }
  };

  const placeShipsInRandom = (isPlayer = true) => {
    const currentPlayer = isPlayer ? player : enemy;
    currentPlayer.board.reset();

    const ai = new AI(size);
    const allShips = [...difficulty[mode].ships];
    let currentShip = null;

    while (allShips.length) {
      currentShip = allShips.shift();

      let currentCount = currentShip.number;
      while (currentCount) {
        const move = ai.placeShipInRandom();
        console.log('Placing ship...');
        if (
          placeShip({
            board: currentPlayer.board,
            name: currentShip.name,
            ...move,
          })
        ) {
          isPlayer
            ? setPlayerBoard(currentPlayer.board.getBoard())
            : setEnemyBoard(currentPlayer.board.getBoard());
          currentCount -= 1;
        }
      }
    }

    //console.table(playerBoard);
  };

  const startGame = () => {
    setIsGameStart(true);
  };

  return (
    <>
      {isGameStart ? null : <button onClick={startGame}>Start</button>}
      <div>
        <Board size={size} board={playerBoard} />
        {isGameStart ? null : (
          <button onClick={placeShipsInRandom}>Randomize</button>
        )}
        <Board size={size} board={enemyBoard} />
      </div>
    </>
  );
};

export default Game;
