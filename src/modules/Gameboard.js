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
    const [rowLimit, columnLimit] =
      direction === 'y' ? [length + 1, 1] : [1, length + 1];

    const start = [pos.start.x - 1, pos.start.y - 1];
    const end = [pos.end.x + 1, pos.end.y + 1];
    // let xi = 0;
    // let yi = 0;

    for (let i = 0; i <= columnLimit; i++) {
      try {
        get(start[0], start[1] + i);

        board[start[0]][start[1] + i] = undefined;
      } catch (error) {
        continue;
      }
    }

    for (let i = 0; i <= columnLimit; i++) {
      try {
        get(end[0], end[1] - i);

        board[end[0]][end[1] - i] = undefined;
      } catch (error) {
        continue;
      }
    }

    for (let j = 0; j <= rowLimit; j++) {
      try {
        // Just to check if out of bounds
        get(start[0] + j, start[1]);

        board[start[0] + j][start[1]] = undefined;
      } catch (error) {
        continue;
      }
    }

    for (let j = 0; j <= rowLimit; j++) {
      try {
        get(end[0] - j, end[1]);
        board[end[0] - j][end[1]] = undefined;
      } catch (error) {
        continue;
      }
    }
  };

  const placeShip = ({ pos, ship, direction = 'x' }) => {
    const id = Math.random().toString(36).substr(2, 4);
    state.ships.set(id, ship);

    const [verticalIncrement, horizontalIncrement] =
      direction === 'y' ? [1, 0] : [0, 1];
    const [x, y] = pos;

    // Preliminary check
    // Check if cell is within a ship's surroundings
    if (get(x, y) === undefined)
      throw new Error('Cannot place ships next to each other');

    // Check if cell is already marked
    if (get(x, y) !== null) throw new Error('Cell already occupied');

    let xi = 0;
    let yi = 0;

    for (let i = 0; i < ship.length; i++) {
      let marker;

      // Check if placing will result in ship
      // to go off the board
      try {
        marker = get(x + xi, y + yi);
      } catch (error) {
        console.log(error.toString());
        throw new Error('Ship go off bounds');
      }

      // Throw error if placing will result in the ship
      // occupying another ship's surroundings
      if (marker === undefined)
        throw new Error('Cannot place ships next to each other');

      // Throw error when placing will result in overlap
      if (marker !== null) throw new Error('Ship overlapped with another ship');

      board[x + xi][y + yi] = `${ship.name}[${i}]_${id}`;

      xi += verticalIncrement;
      yi += horizontalIncrement;
    }

    const coordinates = {
      start: { x, y },
      end: {
        x: direction === 'y' ? x + ship.length - 1 : x,
        y: direction === 'x' ? y + ship.length - 1 : y,
      },
    };

    markSurroundings(coordinates, ship.length, direction);

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
