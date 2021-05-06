import React, { useState, useEffect, useCallback } from 'react';
import difficulty from './difficulty.json';
import ships from './ships.json';
import Gameboard from './modules/Gameboard';
import Ship from './modules/Ship';
import AI from './modules/Player';
import Board from './components/Board';

const Game = ({ mode }) => {
  const [isGameStart, setIsGameStart] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false); // the value doesn't matter, we just need this to trigger a reset
  const size = difficulty[mode].size;
  const ai = new AI(size);

  const [playerBoard, setPlayerBoard] = useState();
  const [enemyBoard, setEnemyBoard] = useState();
  // let playerBoard = Gameboard(size);
  // let enemyBoard = Gameboard(size);

  const [player, setPlayer] = useState({
    type: 'human',
    board: [],
  });
  const [enemy, setEnemy] = useState({
    type: 'computer',
    board: [],
  });

  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

  useEffect(() => {
    console.log('Resetting...');
    setPlayer({
      type: 'human',
      board: [],
    });
    setEnemy({
      type: 'computer',
      board: [],
    });
    setIsGameStart(false);
    //setIsGameOver(false);
    setIsPlayerTurn(true);
    setPlayerBoard(null);
    setEnemyBoard(null);
  }, [mode, isGameOver]);

  const placeShipsInRandom = useCallback(
    (isPlayer = true) => {
      console.log('Placing ships...');
      const currentBoard = Gameboard(size);

      const virtualAI = new AI(size);
      const allShips = [...difficulty[mode].ships];
      let currentShip = null;

      while (allShips.length) {
        currentShip = allShips.shift();

        let currentCount = currentShip.number;
        while (currentCount) {
          const move = virtualAI.placeShipInRandom();
          const shipDetails = ships[currentShip.name];
          const ship = new Ship(shipDetails.name, shipDetails.length);

          try {
            currentBoard.placeShip({ ship, ...move });
            currentCount -= 1;
          } catch (error) {
            continue;
          }
        }
      }

      isPlayer
        ? setPlayer({ board: currentBoard.getBoard() })
        : setEnemy({ board: currentBoard.getBoard() });

      isPlayer ? setPlayerBoard(currentBoard) : setEnemyBoard(currentBoard);
    },
    [mode, size]
  );

  const startGame = () => {
    alert('Game start!');
    setIsGameStart(true);
  };

  // This should run on mount
  // And any clicks on randomize button
  // const randomize = () => {
  //   placeShipsInRandom(true);
  //   placeShipsInRandom(false);
  // };

  useEffect(() => {
    placeShipsInRandom(true);
    placeShipsInRandom(false);
  }, [placeShipsInRandom, isGameOver]);

  const checkForWinner = () => {
    console.log('Checking for winner...');
    if (playerBoard.isGameOver()) {
      alert('Computer wins!');
      setIsGameOver(!isGameOver);
    } else if (enemyBoard.isGameOver()) {
      alert('You won!');
      setIsGameOver(!isGameOver);
    }

    // console.table(playerBoard.getBoard());
    // console.table(enemyBoard.getBoard());
  };

  const attack = (x, y) => {
    try {
      console.log('Attacking...');
      !isPlayerTurn
        ? playerBoard.receiveAttack(x, y)
        : enemyBoard.receiveAttack(x, y);

      !isPlayerTurn
        ? setPlayer({ board: playerBoard.getBoard() })
        : setEnemy({ board: enemyBoard.getBoard() });

      setIsPlayerTurn(!isPlayerTurn);
      checkForWinner();
    } catch (error) {
      console.warn(error.toString());
    }
  };

  // useEffect(() => {
  //   if (!isPlayerTurn && isGameStart) {
  //     setTimeout(() => {
  //       playerBoard.receiveAttack(...ai.attackInRandom());
  //       setIsPlayerTurn(true);
  //     }, 500);
  //   }
  // }, [ai, playerBoard, isGameStart, isPlayerTurn]);

  return (
    <>
      {isGameStart ? null : <button onClick={startGame}>Start</button>}
      {isGameStart ? null : (
        <button onClick={() => placeShipsInRandom(true)}>Randomize</button>
      )}
      <div class="container">
        <Board
          type="human"
          gameStart={isGameStart}
          size={size}
          board={player.board}
          myTurn={isPlayerTurn}
          clickHandler={attack}
        />
        <Board
          type="computer"
          gameStart={isGameStart}
          size={size}
          board={enemy.board}
          myTurn={!isPlayerTurn}
          clickHandler={attack}
        />
      </div>
    </>
  );
};

export default Game;
