import { uuid } from '../utils';

const tryCatchForLoop = (limit, fn, start = 0) => {
  for (let i = start; i < limit; i++) {
    try {
      fn.call(null, i);
    } catch (error) {
      continue;
    }
  }
};

const Gameboard = (size) => {
  let board = [...new Array(size).fill([])].map(() => [
    ...new Array(size).fill(null),
  ]);

  const getBoard = () => [...board].map((row) => [...row]);

  const state = {
    ships: new Map(),
  };

  const _reflectBoardChanges = (copy) => {
    board = copy;
  };

  const _markSurroundings = (pos, length, direction) => {
    const boardCopy = getBoard();
    const [rowLimit, columnLimit] =
      direction === 'y' ? [length + 2, 2] : [2, length + 2];

    const start = [pos.start.row - 1, pos.start.col - 1];
    const end = [pos.end.row + 1, pos.end.col + 1];

    tryCatchForLoop(columnLimit, (i) => {
      get(start[0], start[1] + i);
      boardCopy[start[0]][start[1] + i] = undefined;
    });
    tryCatchForLoop(columnLimit, (i) => {
      get(end[0], end[1] - i);
      boardCopy[end[0]][end[1] - i] = undefined;
    });
    tryCatchForLoop(rowLimit, (i) => {
      get(start[0] + i, start[1]);
      boardCopy[start[0] + i][start[1]] = undefined;
    });
    tryCatchForLoop(rowLimit, (i) => {
      get(end[0] - i, end[1]);
      boardCopy[end[0] - i][end[1]] = undefined;
    });

    _reflectBoardChanges(boardCopy);
  };

  const get = (row, col) => {
    if (row < 0 || row > size - 1 || col < 0 || col > size - 1) {
      throw new Error('Coordinates is off bounds');
    }

    return board[row][col];
  };

  const placeShip = ({ pos, ship, direction = 'x' }) => {
    const boardCopy = getBoard();

    const id = uuid(4);
    state.ships.set(id, ship);

    const [rowIncrement, columnIncrement] = direction === 'y' ? [1, 0] : [0, 1];
    const [row, col] = pos;

    // Check if cell is already marked
    if (typeof get(row, col) === 'string') throw new Error('Cell occupied');

    let xi = 0;
    let yi = 0;

    for (let i = 0; i < ship.length; i++) {
      let marker;

      // Check if placing will result in ship
      // to go off the board
      try {
        marker = get(row + yi, col + xi);
      } catch (error) {
        throw new Error('Ship off-bounds');
      }

      // Throw error if placing will result in the ship
      // occupying another ship's surroundings
      if (marker === undefined) throw new Error('Cell within a ship territory');

      // Throw error when placing will result in overlap
      if (marker !== null) throw new Error('Ship overlaps');

      boardCopy[row + yi][col + xi] = `${ship.name}[${i}]_${id}`;

      xi += columnIncrement;
      yi += rowIncrement;
    }

    _reflectBoardChanges(boardCopy);

    const coordinates = {
      start: { row, col },
      end: {
        row: direction === 'y' ? row + ship.length - 1 : row,
        col: direction === 'x' ? col + ship.length - 1 : col,
      },
    };

    _markSurroundings(coordinates, ship.length, direction);

    return true;
  };

  const isGameOver = () => {
    // return board.every((row) =>
    //   row.every((cell) => ['HIT', 'MISS', null].includes(cell))
    // );

    // v2
    return Array.from(state.ships, ([key, value]) => ({
      key,
      value,
    })).every(({ value: ship }) => ship.isSunk());
  };

  const receiveAttack = (x, y) => {
    const boardCopy = getBoard();
    const marker = get(x, y);

    if (marker === 'HIT' || marker === 'MISS') {
      throw new Error(`Cell[${x}][${y}] was already selected`);
    }

    if (!marker) {
      boardCopy[x][y] = 'MISS';
      _reflectBoardChanges(boardCopy);

      return false;
    }

    const index = marker.match(/\[(\d)\]/)[1];
    const id = marker.split('_')[1];

    const ship = state.ships.get(id);
    ship.hit(index);

    boardCopy[x][y] = 'HIT';
    _reflectBoardChanges(boardCopy);

    return true;
  };

  return {
    get,
    getBoard,
    placeShip,
    receiveAttack,
    isGameOver,
  };
};

export default Gameboard;
