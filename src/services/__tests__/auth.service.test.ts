// src/services/__tests__/auth.service.test.ts
import { jest } from '@jest/globals';

describe('AuthService', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };

    // Silence dotenv logs if your code loads dotenv at import time
    jest.doMock('dotenv', () => ({ config: jest.fn(() => ({ parsed: {} })) }));

    // Mock config values used by the service
    jest.doMock('../../config', () => ({
      __esModule: true,
      JWT_SECRETS: 'test-secret',
      JWT_EXPIRES_IN: '7d',
      BCRYPT_SALT_ROUNDS: 4,
      CLIENT_URL: 'http://client.test'
    }));

    // Mock bcryptjs: provide both default and named exports
    const hashMock = jest.fn((s: string) => Promise.resolve(`hashed-${s}`));
    const compareMock = jest.fn((plain: string, hash: string) => Promise.resolve(hash === `hashed-${plain}`));
    jest.doMock('bcryptjs', () => ({
      __esModule: true,
      default: { hash: hashMock, compare: compareMock },
      hash: hashMock,
      compare: compareMock
    }));

    // Mock jsonwebtoken: provide both default and named exports
    const signMock = jest.fn((payload: any) => 'signed-token');
    const verifyMock = jest.fn((token: string) => ({ id: 'u1' }));
    jest.doMock('jsonwebtoken', () => ({
      __esModule: true,
      default: { sign: signMock, verify: verifyMock },
      sign: signMock,
      verify: verifyMock
    }));


    // Repository mocks (constructors return these objects)
    const userRepo = {
      getUserByEmail: jest.fn(),
      createUser: jest.fn(),
      deleteUserByID: jest.fn(),
      getUserByID: jest.fn(),
      updateUser: jest.fn()
    };
    const consumerRepo = { createConsumer: jest.fn() };
    const retailerRepo = { createRetailer: jest.fn() };

    jest.doMock('../../repository/user.repository', () => ({
      __esModule: true,
      UserRepository: jest.fn(() => userRepo)
    }));
    jest.doMock('../../repository/consumer.repository', () => ({
      __esModule: true,
      ConsumerRepository: jest.fn(() => consumerRepo)
    }));
    jest.doMock('../../repository/retailer.repository', () => ({
      __esModule: true,
      RetailerRepository: jest.fn(() => retailerRepo)
    }));
  });

  afterEach(() => {
    process.env = OLD_ENV;
    jest.restoreAllMocks();
  });

  it('registerConsumer succeeds and returns token payload', async () => {
    const { AuthService } = require('../../services/auth.service');
    const userRepo = require('../../repository/user.repository').UserRepository();
    const consumerRepo = require('../../repository/consumer.repository').ConsumerRepository();

    userRepo.getUserByEmail.mockResolvedValue(null);
    userRepo.createUser.mockResolvedValue({ _id: 'u1', email: 'e', role: 'consumer', passwordHash: 'hashed-p' });
    consumerRepo.createConsumer.mockResolvedValue({ authId: 'u1' });

    const svc = new AuthService();
    const out = await svc.registerConsumer({
      email: 'e',
      password: 'p',
      fullName: 'Name',
      username: 'uname',
      phoneNumber: '12345',
      dob: '',
      gender: '',
      country: ''
    });

    expect(out).toBeDefined();
    expect(out.success).toBe(true);
    expect(userRepo.createUser).toHaveBeenCalled();
  });

  it('registerConsumer rolls back when consumer creation fails', async () => {
    const { AuthService } = require('../../services/auth.service');
    const userRepo = require('../../repository/user.repository').UserRepository();
    const consumerRepo = require('../../repository/consumer.repository').ConsumerRepository();

    userRepo.getUserByEmail.mockResolvedValue(null);
    userRepo.createUser.mockResolvedValue({ _id: 'u1', email: 'e', role: 'consumer' });
    consumerRepo.createConsumer.mockRejectedValue(new Error('consumer-fail'));

    const svc = new AuthService();
    await expect(
      svc.registerConsumer({
        email: 'e',
        password: 'p',
        fullName: 'n',
        username: 'u',
        phoneNumber: 'p',
        dob: '',
        gender: '',
        country: ''
      })
    ).rejects.toThrow('consumer-fail');

    expect(userRepo.deleteUserByID).toHaveBeenCalledWith('u1');
  });

  it('login succeeds with correct credentials and fails otherwise', async () => {
    const { AuthService } = require('../../services/auth.service');
    const userRepo = require('../../repository/user.repository').UserRepository();

    userRepo.getUserByEmail.mockResolvedValue({ _id: 'u1', email: 'e', passwordHash: 'hashed-p', role: 'consumer' });

    const svc = new AuthService();
    const ok = await svc.login({ email: 'e', password: 'p' });
    expect(ok.token).toBeDefined();

    userRepo.getUserByEmail.mockResolvedValue(null);
    await expect(svc.login({ email: 'nope', password: 'p' })).rejects.toThrow();
  });

  it('sendResetPasswordEmail and resetPassword flows', async () => {
    const { AuthService } = require('../../services/auth.service');
    const userRepo = require('../../repository/user.repository').UserRepository();

    userRepo.getUserByEmail.mockResolvedValue({ _id: 'u1', email: 'e' });
    userRepo.getUserByID.mockResolvedValue({ _id: 'u1', email: 'e' });
    userRepo.updateUser.mockResolvedValue({ _id: 'u1' });

    const svc = new AuthService();

    const user = await svc.sendResetPasswordEmail('e');
    expect(user.email).toBe('e');

    const jwt = require('jsonwebtoken');
    jwt.sign.mockReturnValue('tok');
    jwt.verify.mockReturnValue({ id: 'u1' });

    await expect(svc.resetPassword('tok', 'newpass')).resolves.toBeDefined();
    expect(userRepo.updateUser).toHaveBeenCalled();
  });

  it('sendResetPasswordEmail throws when email missing or user not found', async () => {
    const { AuthService } = require('../../services/auth.service');
    const userRepo = require('../../repository/user.repository').UserRepository();
    userRepo.getUserByEmail.mockResolvedValue(null);

    const svc = new AuthService();
    await expect(svc.sendResetPasswordEmail(undefined)).rejects.toThrow();
    await expect(svc.sendResetPasswordEmail('notfound@example.com')).rejects.toThrow('User not found');
  });

  it('resetPassword throws for invalid token or missing params', async () => {
    const { AuthService } = require('../../services/auth.service');
    const svc = new (require('../../services/auth.service').AuthService)();
    await expect(svc.resetPassword(undefined, 'p')).rejects.toThrow();
    await expect(svc.resetPassword('badtoken', undefined)).rejects.toThrow();
  });
});
