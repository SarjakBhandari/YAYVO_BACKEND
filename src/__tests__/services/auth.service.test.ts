import { IUser } from "../../models/user.model";
import mongoose from "mongoose";
import { HttpError } from "../../errors/http.error";
import bcrypt from "bcryptjs";

const mockGetUserByEmail = jest.fn();
const mockCreateUser = jest.fn();
const mockDeleteUserByID = jest.fn();

jest.doMock("../../repository/user.repository", () => {
  return {
    UserRepository: jest.fn().mockImplementation(() => {
      return {
        getUserByEmail: mockGetUserByEmail,
        createUser: mockCreateUser,
        deleteUserByID: mockDeleteUserByID,
      };
    }),
  };
});

const mockCreateConsumer = jest.fn();
jest.doMock("../../repository/consumer.repository", () => {
  return {
    ConsumerRepository: jest.fn().mockImplementation(() => {
      return {
        createConsumer: mockCreateConsumer,
      };
    }),
  };
});

const mockCreateRetailer = jest.fn();
jest.doMock("../../repository/retailer.repository", () => {
  return {
    RetailerRepository: jest.fn().mockImplementation(() => {
      return {
        createRetailer: mockCreateRetailer,
      };
    }),
  };
});

import { AuthService } from "../../services/auth.service";

describe("AuthService", () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("should return a token for valid credentials", async () => {
      const input = { email: "test@test.com", password: "password" };
      const user = {
        _id: new mongoose.Types.ObjectId(),
        email: input.email,
        passwordHash: "hashedpassword",
        role: "consumer",
      } as IUser;

      mockGetUserByEmail.mockResolvedValue(user);
      jest.spyOn(bcrypt, "compare").mockResolvedValue(true as never);

      const result = await authService.login(input);

      expect(result.success).toBe(true);
      expect(result.token).toBeDefined();
    });

    it("should throw an error for an invalid email", async () => {
      const input = { email: "wrong@test.com", password: "password" };

      mockGetUserByEmail.mockResolvedValue(null);

      await expect(authService.login(input)).rejects.toThrow(
        new HttpError(401, "Invalid credentials")
      );
    });

    it("should throw an error for an incorrect password", async () => {
      const input = { email: "test@test.com", password: "wrongpassword" };
      const user = {
        _id: new mongoose.Types.ObjectId(),
        email: input.email,
        passwordHash: "hashedpassword",
      } as IUser;

      mockGetUserByEmail.mockResolvedValue(user);
      jest.spyOn(bcrypt, "compare").mockResolvedValue(false as never);

      await expect(authService.login(input)).rejects.toThrow(
        new HttpError(401, "Invalid credentials")
      );
    });
  });
});