import mongoose from "mongoose";
import { UserModel, IUser } from "../../models/user.model";

describe("User Model", () => {
  afterEach(async () => {
    await UserModel.deleteMany({});
  });

  it("should create a user with all required fields", async () => {
    const userData: IUser = {
      email: "test@example.com",
      passwordHash: "somehash",
      role: "consumer",
    } as IUser;

    const user = new UserModel(userData);
    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.passwordHash).toBe(userData.passwordHash);
    expect(savedUser.role).toBe(userData.role);
  });

  it("should fail to create a user with a duplicate email", async () => {
    const userData1 = {
      email: "test@example.com",
      passwordHash: "somehash",
      role: "consumer",
    };
    const user1 = new UserModel(userData1);
    await user1.save();

    const userData2 = {
      email: "test@example.com",
      passwordHash: "anotherhash",
      role: "retailer",
    };
    const user2 = new UserModel(userData2);

    await expect(user2.save()).rejects.toThrow();
  });

  it("should fail to create a user without required fields", async () => {
    const userData = {
      email: "test@example.com",
      // Missing passwordHash and role
    };
    const user = new UserModel(userData);

    await expect(user.save()).rejects.toThrow();
  });

  it("should fail to create a user with an invalid role", async () => {
    const userData = {
      email: "test@example.com",
      passwordHash: "somehash",
      role: "invalidrole",
    };
    const user = new UserModel(userData);

    await expect(user.save()).rejects.toThrow();
  });
});
