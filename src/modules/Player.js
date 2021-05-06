class AI {
  constructor(size) {
    this.size = size;
    this.pastMoves = [];
  }

  makeMove() {
    return [
      Math.floor(Math.random() * this.size),
      Math.floor(Math.random() * this.size),
    ];
  }

  attackInRandom() {
    let move;

    do {
      move = this.makeMove();
    } while (this.pastMoves.includes(move.join('-')));

    return move;
  }

  placeShipInRandom() {
    return {
      pos: this.makeMove,
      direction: Math.floor(Math.random() * 2) ? 'x' : 'y',
    };
  }
}

export default AI;
