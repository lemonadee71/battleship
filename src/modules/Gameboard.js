const Gameboard = (size) => {
  const board = [...new Array(size).fill([])].map(() => [
    ...new Array(size).fill(null),
  ]);

  const state = {
    ships: new Map(),
  };

  const get = (x, y) => {
    if (x < 0 || x > size - 1 || y < 0 || y > size - 1) {
      throw new Error('Coordinates is off bounds');
    }

    return board[x][y];
  };

  const markSurroundings = (pos, length, direction) => {
    const [verticalLimit, horizontalLimit] =
      direction === 'y' ? [length + 1, 1] : [1, length + 1];

    const start = [pos.start.x - 1, pos.start.y - 1];
    const end = [pos.end.x + 1, pos.end.y + 1];
    let xi = 1;
    let yi = 1;
    for (let i = xi; i <= horizontalLimit; i++) {
      // if (
      //   start[1] + xi > size - 1 ||
      //   start[1] < 0 ||
      //   end[1] - xi < 0 ||
      //   end[1] > size - 1
      // )
      //   continue;

      board[start[0]][start[1] + xi] = undefined;
      board[end[0]][end[1] - xi] = undefined;

      xi += i;
    }

    for (let j = yi; j <= verticalLimit; j++) {
      // if (
      //   start[0] + yi > size - 1 ||
      //   start[0] < 0 ||
      //   end[0] - yi < 0 ||
      //   end[0] > size - 1
      // )
      //   continue;

      board[start[0] + yi][start[1]] = undefined;
      board[end[0] - yi][end[1]] = undefined;

      yi += j;
    }
  };

  const placeShip = ({ pos, ship, direction = 'x' }) => {
    const id = Math.random().toString(36).substr(2, 4);
    console.log(id);
    state.ships.set(id, ship);

    const [verticalIncrement, horizontalIncrement] =
      direction === 'y' ? [1, 0] : [0, 1];
    const [x, y] = pos;

    if (x < 0 || x > size - 1 || y < 0 || y > size - 1) return false;

    // Check if cell is already marked
    // or is within a cell of another ship
    if (get(x, y) !== null) throw new Error('Cell already occupied');

    // Check if placing will result in ship
    // to go off the board
    if (
      (direction === x && x + ship.length > size) ||
      (direction === y && y + ship.length > size)
    )
      throw new Error('Ship go off bounds');

    let xi = 0;
    let yi = 0;
    const coordinates = { start: { x, y }, end: { x: xi, y: yi } };

    for (let i = 0; i < ship.length; i++) {
      if (get(x + xi, y + yi) !== null)
        throw new Error('Ship overlapped with another ship');

      board[x + xi][y + yi] = `${ship.name}[${i}]_${id}`;

      xi += verticalIncrement;
      yi += horizontalIncrement;

      coordinates.end.x = xi;
      coordinates.end.y = yi;
    }

    // markSurroundings(coordinates, ship.length, direction);

    return true;
  };

  const isGameOver = () => {
    return board.every((row) =>
      row.every((cell) => ['HIT', 'MISS', null].includes(cell))
    );
  };

  const receiveAttack = (x, y) => {
    try {
      const marker = get(x, y);

      if (marker === 'HIT' || marker === 'MISS') {
        throw new Error(`Cell[${x}][${y}] was already selected`);
      }

      if (!marker) {
        board[x][y] = 'MISS';

        return false;
      }

      const index = marker.match(/\[(\d)\]/)[1];
      const id = marker.split('_')[1];

      const ship = state.ships.get(id);
      ship.hit(index);

      board[x][y] = 'HIT';

      return true;
    } catch (error) {
      throw error;
    }
  };

  return {
    get,
    board,
    placeShip,
    receiveAttack,
    isGameOver,
  };
};

export default Gameboard;
