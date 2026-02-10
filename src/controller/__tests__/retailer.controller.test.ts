// src/controller/__tests__/retailer.controller.test.ts
import httpMocks from 'node-mocks-http';

describe('retailer.controller', () => {
  beforeEach(() => {
    jest.resetModules();
    const svc = {
      create: jest.fn(),
      getAll: jest.fn(),
      getById: jest.fn(),
      getByAuthId: jest.fn(),
      getByUsername: jest.fn(),
      update: jest.fn(),
      updateProfilePicture: jest.fn(),
      delete: jest.fn()
    };
    jest.doMock('../../services/retailer.service', () => ({ __esModule: true, RetailerService: jest.fn(() => svc) }));
  });

  it('createRetailer returns 200 on success', async () => {
    const svc = require('../../services/retailer.service').RetailerService();
    svc.create.mockResolvedValue({ id: 'r1' });
    const { createRetailer } = require('../../controller/retailer.controller');
    const req = httpMocks.createRequest({ body: { username: 'u' } });
    const res = httpMocks.createResponse();
    const next = jest.fn();
    await createRetailer(req, res, next);
    expect(res.statusCode).toBe(200);
  });

  it('updateRetailerProfilePicture returns 400 when no file', async () => {
    const { updateRetailerProfilePicture } = require('../../controller/retailer.controller');
    const req = httpMocks.createRequest({ params: { id: 'a' } });
    const res = httpMocks.createResponse();
    const next = jest.fn();
    await updateRetailerProfilePicture(req, res, next);
    // when no file, controller calls next(err) or returns 400; in your code it returns 400
    expect(res.statusCode).toBe(400);
  });

  it('deleteRetailer returns success', async () => {
    const svc = require('../../services/retailer.service').RetailerService();
    svc.delete.mockResolvedValue({ success: true });
    const { deleteRetailer } = require('../../controller/retailer.controller');
    const req = httpMocks.createRequest({ params: { id: 'a' } });
    const res = httpMocks.createResponse();
    const next = jest.fn();
    await deleteRetailer(req, res, next);
    expect(res._getJSONData()).toEqual({ success: true });
  });
});
