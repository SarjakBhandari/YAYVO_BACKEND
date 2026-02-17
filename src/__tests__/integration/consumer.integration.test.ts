// src/__tests__/integration/consumer.integration.test.ts
import request from "supertest";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { UserModel } from "../../models/user.model";
import { ConsumerModel } from "../../models/consumer.model";

let app: any;

beforeAll(() => {
  // require app after setup.integration.ts has run and set env vars
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  app = require("../../app").default;
});

afterAll(async () => {
  // close mongoose connection after tests
  try {
    await mongoose.connection.close();
  } catch (e) {
    // ignore
  }
});

describe("Consumer integration tests", () => {
  let adminToken: string;
  let consumerAuthId: string;

  beforeEach(async () => {
    // Clean up any previous test artifacts
    await ConsumerModel.deleteMany({ username: /cint/ });
    await UserModel.deleteMany({ email: /@example\.com$/ });

    // create admin user and token
    const admin = await UserModel.create({ email: "admin@example.com", passwordHash: "x", role: "admin" } as any);
    adminToken = jwt.sign(
      { id: admin._id.toString(), role: "admin" },
      process.env.JWT_SECRETS || "test-secret",
      { expiresIn: "1d" }
    );

    // create a consumer user and consumer profile
    const user = await UserModel.create({ email: "cint@example.com", passwordHash: "x", role: "consumer" } as any);
    consumerAuthId = user._id.toString();
    await ConsumerModel.create({
      authId: user._id,
      fullName: "C Int",
      username: "cint",
      phoneNumber: "11111",
    } as any);
  });

  afterEach(async () => {
    // cleanup created users and consumers
    await ConsumerModel.deleteMany({ username: /cint/ });
    await UserModel.deleteMany({ email: /@example\.com$/ });
  });

  test("admin can get all consumers", async () => {
    const res = await request(app).get("/api/admin/consumers").set("Authorization", `Bearer ${adminToken}`);
    if (res.status !== 200) console.error("get all consumers failed body:", res.body);
    expect(res.status).toBe(200);
    // Some APIs return { data: [...] } and some return array directly; accept both
    const bodyIsArray = Array.isArray(res.body);
    const dataIsArray = Array.isArray(res.body?.data);
    expect(bodyIsArray || dataIsArray).toBe(true);
  });

  test("admin can get consumer by id", async () => {
    const consumer = await ConsumerModel.findOne({ username: "cint" }).exec();
    const res = await request(app)
      .get(`/api/admin/consumers/${consumer!._id}`)
      .set("Authorization", `Bearer ${adminToken}`);
    if (res.status !== 200) console.error("get consumer by id failed body:", res.body);
    expect(res.status).toBe(200);
    // Accept response shape either as object or { data: object }
    const payload = res.body?.data ?? res.body;
    expect(payload).toHaveProperty("username", "cint");
  });

  test("admin can get consumer by username", async () => {
    const res = await request(app).get("/api/admin/consumers/username/cint").set("Authorization", `Bearer ${adminToken}`);
    if (res.status !== 200) console.error("get consumer by username failed body:", res.body);
    expect(res.status).toBe(200);
    const payload = res.body?.data ?? res.body;
    expect(payload).toHaveProperty("username", "cint");
  });

  test("admin can update consumer", async () => {
    const consumer = await ConsumerModel.findOne({ username: "cint" }).exec();
    const res = await request(app)
      .put(`/api/admin/consumers/${consumer!._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ fullName: "C Updated" });

    if (res.status !== 200) console.error("update consumer failed body:", res.body);
    expect(res.status).toBe(200);
    const payload = res.body?.data ?? res.body;
    expect(payload).toHaveProperty("fullName", "C Updated");
  });

  test("admin cannot delete unregistered consumer", async () => {
    const consumer = await ConsumerModel.findOne({ username: "cint" }).exec();
    // Simulate deletion of underlying user first so consumer becomes unregistered
    await UserModel.findByIdAndDelete(consumer!.authId).exec();

    const res = await request(app).delete(`/api/admin/consumers/${consumer!._id}`).set("Authorization", `Bearer ${adminToken}`);
    // Accept 404 or 400 depending on implementation
    expect([404, 400]).toContain(res.status);
  });

  test("paginated consumers endpoint returns pagination object", async () => {
    const res = await request(app).get("/api/admin/paginated_consumers?page=1&size=5").set("Authorization", `Bearer ${adminToken}`);
    if (res.status !== 200) console.error("paginated consumers failed body:", res.body);
    expect(res.status).toBe(200);
    // Accept response shape either as { pagination: {...}, data: [...] } or { data: { pagination: {...}, items: [...] } }
    const pagination = res.body?.pagination ?? res.body?.data?.pagination ?? res.body?.data?.pagination;
    expect(pagination).toBeDefined();
    expect(pagination).toHaveProperty("page");
  });
});
