class AI {
  constructor(size) {
    this.size = size;
  }

  attackInRandom(size = 14) {
    return Math.floor(Math.random() * (this.size || size));
  }

  placeShipInRandom() {
    return {
      pos: [
        Math.floor(Math.random() * this.size),
        Math.floor(Math.random() * this.size),
      ],
      direction: Math.floor(Math.random() * 2) ? 'x' : 'y',
    };
  }
}

export default AI;
