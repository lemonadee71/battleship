import AI from './Player';

describe('AI', () => {
  let ai;
  beforeEach(() => {
    ai = new AI();
  });

  it('attacks randomly', () => {
    expect(ai.attackInRandom()).toBeLessThanOrEqual(14);
  });
});
