// src/repository/__tests__/consumer.repository.test.ts
import { ConsumerRepository } from '../consumer.repository';

jest.mock('../../models/consumer.model', () => {
  const mFind = jest.fn().mockReturnThis();
  const mExec = jest.fn();
  const ConsumerModel = {
    find: jest.fn(() => ({ skip: () => ({ limit: () => ({}) }) })),
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn(),
    countDocuments: jest.fn()
  };
  return { ConsumerModel };
});

describe('ConsumerRepository', () => {
  it('getAllUsers calls find and countDocuments', async () => {
    const { ConsumerModel } = require('../../models/consumer.model');
    ConsumerModel.find = jest.fn().mockReturnValue({ skip: jest.fn().mockReturnValue({ limit: jest.fn().mockResolvedValue([{ username: 'a' }]) }) });
    ConsumerModel.countDocuments = jest.fn().mockResolvedValue(1);

    const repo = new ConsumerRepository();
    const res = await repo.getAllUsers(1, 10, 'x');
    expect(res.users.length).toBe(1);
    expect(res.total).toBe(1);
  });
});
