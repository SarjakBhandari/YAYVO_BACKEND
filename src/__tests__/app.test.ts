// src/__tests__/app.test.ts
import request from 'supertest';
import express from 'express';

describe('app', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock('../config', () => ({ __esModule: true, CORS_DOMAIN_FIRST: 'https://a', CORS_DOMAIN_SECOND: 'https://b' }));
    const corsMock = jest.fn((opts: any) => (req: express.Request, res: express.Response, next: express.NextFunction) => { (req as any).__cors = opts; next(); });
    jest.doMock('cors', () => corsMock);

    const makeRouter = (name: string) => {
      const r = express.Router();
      r.get('/test', (_req, res) => res.json({ ok: `${name}-test` }));
      r.get('/error', (_req, _res, next) => next(new Error(`${name}-boom`)));
      return r;
    };

    jest.doMock('../routes/auth.route', () => makeRouter('auth'));
    jest.doMock('../routes/consumer.route', () => makeRouter('consumer'));
    jest.doMock('../routes/retailer.route', () => makeRouter('retailer'));
    jest.doMock('../routes/admin.routes', () => makeRouter('admin'));
  });

  it('registers cors and routes and error handler', async () => {
    const app = require('../app').default;
    const res = await request(app).get('/api/auth/test');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: 'auth-test' });

    const err = await request(app).get('/api/auth/error');
    expect(err.status).toBe(500);
    expect(err.body).toEqual({ success: false, message: 'auth-boom' });

  });
});
