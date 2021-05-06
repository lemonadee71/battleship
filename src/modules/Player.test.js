import AI from './Player';
import Gameboard from './Gameboard';
import Ship from './Ship';
import difficulty from '../difficulty';
import ships from '../ships';

describe('AI', () => {
  let ai, size, board;
  beforeEach(() => {
    size = difficulty.normal.size;
    ai = new AI(size);
    board = Gameboard(size);
  });

  it('attacks randomly', () => {
    expect(ai.attackInRandom()[0]).toBeLessThanOrEqual(size);
  });

  it('places ships randomly', () => {
    const ship = new Ship(ships.patrolBoat.name, ships.patrolBoat.length);
    const move = ai.placeShipInRandom();

    expect(board.placeShip({ ship, ...move })).toBe(true);
  });
});
