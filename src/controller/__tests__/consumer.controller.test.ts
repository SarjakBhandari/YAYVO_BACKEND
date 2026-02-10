// src/controller/__tests__/consumer.controller.test.ts
import httpMocks from 'node-mocks-http';

describe('consumer.controller', () => {
  beforeEach(() => {
    jest.resetModules();
    const svc = {
      create: jest.fn(),
      getAll: jest.fn(),
      getById: jest.fn(),
      getByUsername: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      updateProfilePicture: jest.fn(),
      getByAuthId: jest.fn(),
      getAllConsumers: jest.fn()
    };
    jest.doMock('../../services/consumer.service', () => ({ __esModule: true, ConsumerService: jest.fn(() => svc) }));
  });

  it('createConsumer returns 200 on success', async () => {
    const svc = require('../../services/consumer.service').ConsumerService();
    svc.create.mockResolvedValue({ id: 'c1' });
    const { createConsumer } = require('../../controller/consumer.controller');
    const req = httpMocks.createRequest({ body: { username: 'u' } });
    const res = httpMocks.createResponse();
    const next = jest.fn();
    await createConsumer(req, res, next);
    expect(res.statusCode).toBe(200);
  });

  it('updateConsumerProfilePicture returns 400 when no file', async () => {
    const { updateConsumerProfilePicture } = require('../../controller/consumer.controller');
    const req = httpMocks.createRequest({ params: { id: 'a' } });
    const res = httpMocks.createResponse();
    await updateConsumerProfilePicture(req, res);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData().success).toBe(false);
  });

  it('getAllConsumers returns paginated result', async () => {
    const svc = require('../../services/consumer.service').ConsumerService();
    svc.getAllConsumers.mockResolvedValue({ users: [{ username: 'a' }], pagination: { page: 1, size: 10, totalItems: 1, totalPages: 1 } });
    const { getAllConsumers } = require('../../controller/consumer.controller');
    const req = httpMocks.createRequest({ query: { page: '1', size: '10' } });
    const res = httpMocks.createResponse();
    const next = jest.fn();
    await getAllConsumers(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().success).toBe(true);
  });
});

