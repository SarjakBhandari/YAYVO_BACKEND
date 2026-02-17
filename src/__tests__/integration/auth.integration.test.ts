// src/__tests__/integration/auth.integration.test.ts
import request from "supertest";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { UserModel } from "../../models/user.model";

let app: any;

beforeAll(() => {
  // require app after setup.integration.ts has run and set env vars
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  app = require("../../app").default;
});

afterAll(async () => {
  // ensure mongoose connections are closed after tests
  try {
    await mongoose.connection.close();
  } catch (e) {
    // ignore
  }
});

describe("Auth integration tests", () => {
  const consumerPayload = {
    email: "int-consumer@example.com",
    password: "password123",
    fullName: "Integration Consumer",
    username: "intconsumer",
    phoneNumber: "1234567890",
    dob: "1990-01-01",
    gender: "other",
    country: "Testland",
  };

  test("register consumer returns success and token", async () => {
    // cleanup any previous test user
    await UserModel.deleteMany({ $or: [{ email: consumerPayload.email }, { username: consumerPayload.username }] });

    const res = await request(app).post("/api/auth/register/consumer").send(consumerPayload);
    expect([200, 201]).toContain(res.status);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("token");
  });

  test("registering same email again returns 409", async () => {
    const email = "duplicate@example.com";
    // ensure first registration exists
    await UserModel.deleteMany({ email });
    await request(app)
      .post("/api/auth/register/consumer")
      .send({ ...consumerPayload, email, username: "dup1" });

    const res = await request(app)
      .post("/api/auth/register/consumer")
      .send({ ...consumerPayload, email, username: "dup2" });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  test("login with valid credentials returns token", async () => {
    const email = "login@example.com";
    const password = "password123";

    // ensure user exists by registering
    await UserModel.deleteMany({ email });
    await request(app)
      .post("/api/auth/register/consumer")
      .send({ ...consumerPayload, email, username: "loginuser", password });

    const res = await request(app).post("/api/auth/login").send({ email, password });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  test("login with invalid credentials returns 401 or 400/500 depending on validation", async () => {
    const res = await request(app).post("/api/auth/login").send({ email: "noone@example.com", password: "bad" });
    // Accept 401, 400, or 500 depending on validation/error handling
    expect([401, 400, 500]).toContain(res.status);
  });

  test("request password reset for existing user returns success", async () => {
    const email = "resetme@example.com";
    // create a minimal user record
    await UserModel.deleteMany({ email });
    await UserModel.create({ email, passwordHash: "x", role: "consumer" } as any);

    const res = await request(app).post("/api/auth/request-password-reset").send({ email });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("reset password endpoint with token resets password", async () => {
    const email = "rp@example.com";
    await UserModel.deleteMany({ email });
    const user = await UserModel.create({ email, passwordHash: "x", role: "consumer" } as any);

    const secret = process.env.JWT_SECRETS || "test-secret";
    const token = jwt.sign({ id: user._id.toString() }, secret, { expiresIn: "1h" });

    const res = await request(app).post(`/api/auth/reset-password/${token}`).send({ newPassword: "newpassword123" });

    if (res.status !== 200) {
      // helpful debug output for failures
      // eslint-disable-next-line no-console
      console.error("reset-password failed body:", res.body);
    }

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
