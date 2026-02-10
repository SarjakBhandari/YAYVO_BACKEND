// src/services/__tests__/retailer.service.test.ts
describe('RetailerService', () => {
  beforeEach(() => {
    jest.resetModules();
    const repo = {
      findByUsername: jest.fn(),
      createRetailer: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByAuthId: jest.fn(),
      updateRetailer: jest.fn(),
      updateByAuthId: jest.fn(),
      deleteByAuthId: jest.fn(),
      deleteRetailer: jest.fn()
    };
    jest.doMock('../../repository/retailer.repository', () => ({ __esModule: true, RetailerRepository: jest.fn(() => repo) }));
  });

  it('create throws on existing username', async () => {
    const repo = require('../../repository/retailer.repository').RetailerRepository();
    repo.findByUsername.mockResolvedValue({ username: 'x' });
    const { RetailerService } = require('../../services/retailer.service');
    const svc = new RetailerService();
    await expect(svc.create({ username: 'x' } as any)).rejects.toThrow();
  });

  it('getById not found throws', async () => {
    const repo = require('../../repository/retailer.repository').RetailerRepository();
    repo.findById.mockResolvedValue(null);
    const { RetailerService } = require('../../services/retailer.service');
    const svc = new RetailerService();
    await expect(svc.getById('id')).rejects.toThrow('Retailer not found');
  });
});
