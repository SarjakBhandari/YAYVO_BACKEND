// src/__tests__/integration/retailer.integration.test.ts
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { UserModel } from '../../models/user.model';
import { RetailerModel } from '../../models/retailer.model';

let app: any;

beforeAll(() => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  app = require('../../app').default;
});

describe('Retailer integration tests', () => {
  let adminToken: string;
  let retailerAuthId: string;

  beforeEach(async () => {
    const admin = await UserModel.create({ email: 'admin2@example.com', passwordHash: 'x', role: 'admin' });
    adminToken = jwt.sign({ id: admin._id.toString(), role: 'admin' }, process.env.JWT_SECRETS || 'test-secret', { expiresIn: '1d' });

    const user = await UserModel.create({ email: 'rint@example.com', passwordHash: 'x', role: 'retailer' });
    retailerAuthId = user._id.toString();
    await RetailerModel.create({ authId: user._id, ownerName: 'Owner', organizationName: 'Org', username: 'rint' });
  });

  it('admin can get all retailers', async () => {
    const res = await request(app).get('/api/admin/retailers').set('Authorization', `Bearer ${adminToken}`);
    if (res.status !== 200) console.error('get all retailers failed body:', res.body);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('admin can get retailer by id', async () => {
    const r = await RetailerModel.findOne({ username: 'rint' }).exec();
    const res = await request(app).get(`/api/admin/retailers/${r!._id}`).set('Authorization', `Bearer ${adminToken}`);
    if (res.status !== 200) console.error('get retailer by id failed body:', res.body);
    expect(res.status).toBe(200);
  });

  it('admin can get  retailer by authId', async () => {
    const res = await request(app).get(`/api/admin/retailers/auth/${retailerAuthId}`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
  });

  it('admin cannot delete not existing retailer', async () => {
    const r = await RetailerModel.findOne({ username: 'rint' }).exec();
    const res = await request(app).delete(`/api/admin/retailers/${r!._id}`).set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(404);
  });

  it('retailer update profile picture endpoint returns 400 when no file', async () => {
    const user = await UserModel.create({ email: 'rp2@example.com', passwordHash: 'x', role: 'retailer' });
    const token = jwt.sign({ id: user._id.toString(), role: 'retailer' }, process.env.JWT_SECRETS || 'test-secret', { expiresIn: '1d' });
    const res = await request(app).put(`/api/retailers/auth/${user._id}/profile-picture`).set('Authorization', `Bearer ${token}`);
    if (res.status !== 400) console.error('update profile picture failed body:', res.body);
    expect(res.status).toBe(400);
  });
});
