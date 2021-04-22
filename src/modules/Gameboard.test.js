import Gameboard from './Gameboard';
import Ship from './Ship';
import shipTypes from './shipTypes';

describe('Gameboard', () => {
  const coord = [0, 0];
  let board, ship;

  beforeEach(() => {
    board = Gameboard(5);
    ship = new Ship(shipTypes.patrolBoat.name, shipTypes.patrolBoat.length);
    let anotherShip = new Ship(shipTypes.boat.name, shipTypes.boat.length);

    board.placeShip({ ship, coord, direction: 'x' });
    board.placeShip({ ship: anotherShip, coord: [3, 0] });
  });

  it('place ship on the board', () => {
    let shipLength = 0;
    for (let i = 0; i < ship.length; i++) {
      if (board.board[coord[0]][coord[1] + i].includes(ship.name)) {
        shipLength++;
      }
    }

    expect(shipLength).toBe(ship.length);
  });

  it('lets players attack', () => {
    board.receiveAttack(0, 0);
    board.receiveAttack(0, 1);

    expect(board.get(...coord)).toBe('HIT');
    expect(ship.body[0]).toBe('X');
    expect(ship.isSunk()).toBe(true);
  });

  it('records attack even if miss', () => {
    board.receiveAttack(2, 0);
    board.receiveAttack(0, 3);

    expect(board.get(2, 0)).toBe('MISS');
    expect(board.get(0, 3)).toBe('MISS');
  });

  it('knows when all ships are sunk', () => {
    board.receiveAttack(0, 0);
    board.receiveAttack(0, 1);
    board.receiveAttack(3, 0);
    board.receiveAttack(2, 0);
    board.receiveAttack(0, 3);

    // console.log(board.board);
    expect(board.isGameOver()).toBe(true);
  });

  it('throws error when same cell is selected twice', () => {
    board.receiveAttack(0, 0);

    expect(() => board.receiveAttack(0, 0)).toThrowError();
  });

  // it('does not allow placing ships next to each other', () => {

  // })
});
