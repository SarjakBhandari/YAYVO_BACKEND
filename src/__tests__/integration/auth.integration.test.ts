// src/__tests__/integration/auth.integration.test.ts
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { UserModel } from '../../models/user.model';

let app: any;

beforeAll(() => {
  // require app after setup.integration.ts has run and set env vars
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  app = require('../../app').default;
});

describe('Auth integration tests', () => {
  const consumerPayload = {
    email: 'int-consumer@example.com',
    password: 'password123',
    fullName: 'Integration Consumer',
    username: 'intconsumer',
    phoneNumber: '1234567890',
    dob: '1990-01-01',
    gender: 'other',
    country: 'Testland'
  };

  it('register consumer returns success and token', async () => {
    const res = await request(app).post('/api/auth/register/consumer').send(consumerPayload);
    expect([200, 201]).toContain(res.status);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('token');
  });

  it('registering same email again returns 409', async () => {
    await request(app).post('/api/auth/register/consumer').send({
      ...consumerPayload,
      email: 'duplicate@example.com',
      username: 'dup1'
    });
    const res = await request(app).post('/api/auth/register/consumer').send({
      ...consumerPayload,
      email: 'duplicate@example.com',
      username: 'dup2'
    });
    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('login with valid credentials returns token', async () => {
    const email = 'login@example.com';
    const password = 'password123';
    await request(app).post('/api/auth/register/consumer').send({
      ...consumerPayload,
      email,
      username: 'loginuser',
      password
    });
    const res = await request(app).post('/api/auth/login').send({ email, password });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  it('login with invalid credentials returns 401 or 500 depending on validation', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'noone@example.com', password: 'bad' });
    // Accept 401 or 500 depending on your validation layer; assert failure
    expect([401, 400, 500]).toContain(res.status);
  });

  it('request password reset for existing user returns success', async () => {
    const email = 'resetme@example.com';
    await UserModel.create({ email, passwordHash: 'x', role: 'consumer' });
    const res = await request(app).post('/api/auth/request-password-reset').send({ email });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('reset password endpoint with token resets password', async () => {
    const user = await UserModel.create({ email: 'rp@example.com', passwordHash: 'x', role: 'consumer' });
    // sign token with the same secret set in setup.integration.ts
    const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRETS || 'test-secret', { expiresIn: '1h' });

    const res = await request(app).post(`/api/auth/reset-password/${token}`).send({ newPassword: 'newpassword123' });

    if (res.status !== 200) {
      // helpful debug output for failures
      // eslint-disable-next-line no-console
      console.error('reset-password failed body:', res.body);
    }

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
