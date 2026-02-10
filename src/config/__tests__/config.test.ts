// src/config/__tests__/config.test.ts
describe('src/config', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  function loadConfig() {
    // require after setting process.env so module-level code runs with desired env
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('../index');
  }

  it('parses numeric PORT and BCRYPT_SALT_ROUNDS from env', () => {
    process.env.PORT = '4000';
    process.env.BCRYPT_SALT_ROUNDS = '12';

    const cfg = loadConfig();

    expect(cfg.PORT).toBe(4000);
    expect(cfg.BCRYPT_SALT_ROUNDS).toBe(12);
  });


  it('handles non-numeric PORT gracefully (results in NaN)', () => {
    process.env.PORT = 'not-a-number';
    const cfg = loadConfig();
    // The module uses parseInt so invalid numeric strings produce NaN
    expect(Number.isNaN(cfg.PORT)).toBe(true);
  });

  it('handles non-numeric BCRYPT_SALT_ROUNDS gracefully (results in NaN)', () => {
    process.env.BCRYPT_SALT_ROUNDS = 'abc';
    const cfg = loadConfig();
    expect(Number.isNaN(cfg.BCRYPT_SALT_ROUNDS)).toBe(true);
  });

  it('respects zero and negative numeric env values (edge cases)', () => {
    process.env.PORT = '0';
    process.env.BCRYPT_SALT_ROUNDS = '-5';
    const cfg = loadConfig();
    expect(cfg.PORT).toBe(0);
    expect(cfg.BCRYPT_SALT_ROUNDS).toBe(-5);
  });
});
