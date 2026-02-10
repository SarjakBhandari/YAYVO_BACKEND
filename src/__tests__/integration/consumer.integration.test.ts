// src/__tests__/integration/consumer.integration.test.ts
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { UserModel } from '../../models/user.model';
import { ConsumerModel } from '../../models/consumer.model';

let app: any;

beforeAll(() => {
  // require app after setup
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  app = require('../../app').default;
});

describe('Consumer integration tests', () => {
  let adminToken: string;
  let consumerAuthId: string;

  beforeEach(async () => {
    // create admin user and token
    const admin = await UserModel.create({ email: 'admin@example.com', passwordHash: 'x', role: 'admin' });
    adminToken = jwt.sign({ id: admin._id.toString(), role: 'admin' }, process.env.JWT_SECRETS || 'test-secret', { expiresIn: '1d' });

    // create a consumer
    const user = await UserModel.create({ email: 'cint@example.com', passwordHash: 'x', role: 'consumer' });
    consumerAuthId = user._id.toString();
    await ConsumerModel.create({ authId: user._id, fullName: 'C Int', username: 'cint', phoneNumber: '11111' });
  });

  it('admin can get all consumers', async () => {
    const res = await request(app).get('/api/admin/consumers').set('Authorization', `Bearer ${adminToken}`);
    if (res.status !== 200) console.error('get all consumers failed body:', res.body);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('admin can get consumer by id', async () => {
    const consumer = await ConsumerModel.findOne({ username: 'cint' }).exec();
    const res = await request(app).get(`/api/admin/consumers/${consumer!._id}`).set('Authorization', `Bearer ${adminToken}`);
    if (res.status !== 200) console.error('get consumer by id failed body:', res.body);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('username', 'cint');
  });

  it('admin can get consumer by username', async () => {
    const res = await request(app).get('/api/admin/consumers/username/cint').set('Authorization', `Bearer ${adminToken}`);
    if (res.status !== 200) console.error('get consumer by username failed body:', res.body);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('username', 'cint');
  });

  it('admin can update consumer', async () => {
    const consumer = await ConsumerModel.findOne({ username: 'cint' }).exec();
    const res = await request(app)
      .put(`/api/admin/consumers/${consumer!._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ fullName: 'C Updated' });

    if (res.status !== 200) console.error('update consumer failed body:', res.body);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('fullName', 'C Updated');
  });

  it('admin cannot delete unregistered consumer', async () => {
    const consumer = await ConsumerModel.findOne({ username: 'cint' }).exec();
    const res = await request(app).delete(`/api/admin/consumers/${consumer!._id}`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(404);
  });

  it('paginated consumers endpoint returns pagination object', async () => {
    const res = await request(app).get('/api/admin/paginated_consumers?page=1&size=5').set('Authorization', `Bearer ${adminToken}`);
    if (res.status !== 200) console.error('paginated consumers failed body:', res.body);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('pagination');
    expect(res.body.pagination).toHaveProperty('page');
  });
});
