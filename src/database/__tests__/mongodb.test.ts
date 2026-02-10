// src/database/__tests__/mongodb.test.ts
describe('connectDatabase', () => {
  const OLD_ENV = process.env;
  let connectMock: jest.Mock;
  let exitSpy: jest.SpyInstance;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    connectMock = jest.fn();
    jest.doMock('mongoose', () => ({ __esModule: true, connect: connectMock }));
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    exitSpy = jest.spyOn(process, 'exit').mockImplementation(((code?: number) => { throw new Error(`exit:${code}`); }) as any);
  });

  afterAll(() => {
    process.env = OLD_ENV;
    jest.restoreAllMocks();
  });

  it('exits on connection failure', async () => {
    connectMock.mockRejectedValueOnce(new Error('db down'));
    const { connectDatabase } = require('../../database/mongodb');
    await expect(connectDatabase()).rejects.toThrow('exit:1');
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
