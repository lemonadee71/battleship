const Gameboard = (size) => {
  const board = [...new Array(size).fill([])].map(() => [
    ...new Array(size).fill(null),
  ]);

  const state = {
    ships: new Map(),
  };

  const get = (x, y) => {
    return board[x][y];
  };

  const placeShip = ({ coord, ship, direction = 'x' }) => {
    const id = Math.floor(Math.random() * 100);
    state.ships.set(id, ship);

    const [x, y] = coord;
    const [verticalIncrement, horizontalIncrement] =
      direction === 'y' ? [1, 0] : [0, 1];

    let xi = 0;
    let yi = 0;
    for (let i = 0; i < ship.length; i++) {
      board[x + xi][y + yi] = `${ship.name}[${i}]_${id}`;

      xi += verticalIncrement;
      yi += horizontalIncrement;
    }
  };

  const isGameOver = () => {
    return board.every((row) =>
      row.every((cell) => ['HIT', 'MISS', null].includes(cell))
    );
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

    const ship = state.ships.get(+id);
    ship.hit(index);

    board[x][y] = 'HIT';

    return isGameOver() ? false : true;
  };

  return {
    get,
    board,
    placeShip,
    receiveAttack,
    isGameOver,
  };
};

// const board = Gameboard(5);

export default Gameboard;
