// src/services/__tests__/consumer.service.test.ts
describe('ConsumerService', () => {
  beforeEach(() => {
    jest.resetModules();
    const repo = {
      findByUsername: jest.fn(),
      createConsumer: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByAuthId: jest.fn(),
      updateConsumer: jest.fn(),
      updateByAuthId: jest.fn(),
      deleteConsumer: jest.fn(),
      getAllUsers: jest.fn()
    };
    jest.doMock('../../repository/consumer.repository', () => ({ __esModule: true, ConsumerRepository: jest.fn(() => repo) }));
  });

  it('create throws on existing username', async () => {
    const repo = require('../../repository/consumer.repository').ConsumerRepository();
    repo.findByUsername.mockResolvedValue({ username: 'x' });
    const { ConsumerService } = require('../../services/consumer.service');
    const svc = new ConsumerService();
    await expect(svc.create({ username: 'x' } as any)).rejects.toThrow();
  });

  it('getById not found throws', async () => {
    const repo = require('../../repository/consumer.repository').ConsumerRepository();
    repo.findById.mockResolvedValue(null);
    const { ConsumerService } = require('../../services/consumer.service');
    const svc = new ConsumerService();
    await expect(svc.getById('id')).rejects.toThrow('Consumer not found');
  });

  it('getAllConsumers returns pagination', async () => {
    const repo = require('../../repository/consumer.repository').ConsumerRepository();
    repo.getAllUsers.mockResolvedValue([{ username: 'a' }], 1);
    repo.getAllUsers.mockResolvedValue({ users: [{ username: 'a' }], total: 1 });
    const { ConsumerService } = require('../../services/consumer.service');
    const svc = new ConsumerService();
    const res = await svc.getAllConsumers('1', '10', 'x');
    expect(res.pagination.page).toBe(1);
  });
});
