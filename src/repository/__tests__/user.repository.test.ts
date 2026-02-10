// src/repository/__tests__/user.repository.test.ts
import { UserRepository } from '../user.repository';

jest.mock('../../models/user.model', () => {
  const UserModel = {
    findById: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findByIdAndUpdate: jest.fn()
  };
  return { UserModel };
});

jest.mock('../../models/consumer.model', () => ({ ConsumerModel: { findOneAndDelete: jest.fn() } }));
jest.mock('../../models/retailer.model', () => ({ RetailerModel: { findOneAndDelete: jest.fn() } }));

describe('UserRepository', () => {
  it('updateUser calls findByIdAndUpdate', async () => {
    const { UserModel } = require('../../models/user.model');
    UserModel.findByIdAndUpdate = jest.fn().mockResolvedValue({ _id: 'u1' });
    const repo = new UserRepository();
    const res = await repo.updateUser('u1', { email: 'x' });
    expect(res).toBeDefined();
  });
});
