// src/controllers/__tests__/auth.controller.test.ts
import httpMocks from 'node-mocks-http';

describe('auth.controller', () => {
  beforeEach(() => {
    jest.resetModules();
    const svc = {
      registerConsumer: jest.fn(),
      registerRetailer: jest.fn(),
      login: jest.fn(),
      sendResetPasswordEmail: jest.fn(),
      resetPassword: jest.fn()
    };
    jest.doMock('../../services/auth.service', () => ({ __esModule: true, AuthService: jest.fn(() => svc) }));
  });

  it('registerConsumer returns 200 on success', async () => {
    const svc = require('../../services/auth.service').AuthService();
    svc.registerConsumer.mockResolvedValue({ success: true });
    const { registerConsumer } = require('../../controller/auth.controller');
    const req = httpMocks.createRequest({ body: { email: 'a' } });
    const res = httpMocks.createResponse();
    const next = jest.fn();
    await registerConsumer(req, res, next);
    expect(res.statusCode).toBe(200);
  });

  it('sendResetPasswordEmail returns 200 on success', async () => {
    const svc = require('../../services/auth.service').AuthService();
    svc.sendResetPasswordEmail.mockResolvedValue({ email: 'a' });
    const { sendResetPasswordEmail } = require('../../controller/auth.controller');
    const req = httpMocks.createRequest({ body: { email: 'a' } });
    const res = httpMocks.createResponse();
    await sendResetPasswordEmail(req, res);
    expect(res.statusCode).toBe(200);
  });
});
