// test/setup.integration.ts
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load test env defaults (optional)
dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });

// Keep references for teardown
let mongoServer: MongoMemoryServer;

jest.setTimeout(20000);

// Mock nodemailer globally so sendMail never sends real email
jest.mock('nodemailer', () => {
  return {
    createTransport: jest.fn(() => ({
      sendMail: jest.fn().mockResolvedValue({ messageId: 'mocked' })
    }))
  };
});

// Start in-memory MongoDB before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Ensure your code reads MONGODB_URI from process.env
  process.env.MONGODB_URI = uri;

  // If your app uses other envs, set them here for tests
  process.env.JWT_SECRETS = process.env.JWT_SECRETS || 'test-secret';
  process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
  process.env.BCRYPT_SALT_ROUNDS = process.env.BCRYPT_SALT_ROUNDS || '4';
  process.env.EMAIL = process.env.EMAIL || 'test@example.com';
  process.env.PASSWORD = process.env.PASSWORD || 'testpass';
  process.env.CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

  // Connect mongoose using your connectDatabase or directly
  // If you have a connectDatabase() function, require and call it:
  try {
    // require here to avoid module evaluation before env is set
    const { connectDatabase } = require('../src/database/mongodb');
    await connectDatabase();
  } catch (err) {
    // fallback: connect mongoose directly
    await mongoose.connect(uri);
  }
});

// Clear DB between tests to keep tests isolated
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Stop in-memory MongoDB after all tests
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongoServer) await mongoServer.stop();
});
