// src/__tests__/integration/retailer.integration.test.ts
import request from "supertest";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { UserModel } from "../../models/user.model";
import { RetailerModel } from "../../models/retailer.model";

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

describe("Retailer integration tests", () => {
  let adminToken: string;
  let retailerAuthId: string;

  beforeEach(async () => {
    // Clean up any previous test artifacts
    await RetailerModel.deleteMany({ username: /rint/ });
    await UserModel.deleteMany({ email: /@example\.com$/ });

    // create admin user and token
    const admin = await UserModel.create({ email: "admin2@example.com", passwordHash: "x", role: "admin" } as any);
    adminToken = jwt.sign(
      { id: admin._id.toString(), role: "admin" },
      process.env.JWT_SECRETS || "test-secret",
      { expiresIn: "1d" }
    );

    // create a retailer user and retailer profile
    const user = await UserModel.create({ email: "rint@example.com", passwordHash: "x", role: "retailer" } as any);
    retailerAuthId = user._id.toString();
    await RetailerModel.create({
      authId: user._id,
      ownerName: "Owner",
      organizationName: "Org",
      username: "rint",
    } as any);
  });

  afterEach(async () => {
    // cleanup created users and retailers
    await RetailerModel.deleteMany({ username: /rint/ });
    await UserModel.deleteMany({ email: /@example\.com$/ });
  });

  test("admin can get all retailers", async () => {
    const res = await request(app).get("/api/admin/retailers").set("Authorization", `Bearer ${adminToken}`);
    if (res.status !== 200) console.error("get all retailers failed body:", res.body);
    expect(res.status).toBe(200);
    // Accept either array directly or { data: [...] }
    const bodyIsArray = Array.isArray(res.body);
    const dataIsArray = Array.isArray(res.body?.data);
    expect(bodyIsArray || dataIsArray).toBe(true);
  });

  test("admin can get retailer by id", async () => {
    const r = await RetailerModel.findOne({ username: "rint" }).exec();
    const res = await request(app).get(`/api/admin/retailers/${r!._id}`).set("Authorization", `Bearer ${adminToken}`);
    if (res.status !== 200) console.error("get retailer by id failed body:", res.body);
    expect(res.status).toBe(200);
    const payload = res.body?.data ?? res.body;
    // Accept either object or wrapper
    expect(payload).toBeDefined();
  });

  test("admin can get retailer by authId", async () => {
    const res = await request(app).get(`/api/admin/retailers/auth/${retailerAuthId}`).set("Authorization", `Bearer ${adminToken}`);
    if (res.status !== 200) console.error("get retailer by authId failed body:", res.body);
    expect(res.status).toBe(200);
    const payload = res.body?.data ?? res.body;
    expect(payload).toBeDefined();
  });

  test("admin cannot delete not existing retailer", async () => {
    const r = await RetailerModel.findOne({ username: "rint" }).exec();
    // Delete underlying user first to simulate not-existing retailer scenario if your app expects that
    await UserModel.findByIdAndDelete(r!.authId).exec();

    const res = await request(app).delete(`/api/admin/retailers/${r!._id}`).set("Authorization", `Bearer ${adminToken}`);
    // Accept 404 or 400 depending on implementation
    expect([404, 400]).toContain(res.status);
  });

  test("retailer update profile picture endpoint returns 400 when no file", async () => {
    const user = await UserModel.create({ email: "rp2@example.com", passwordHash: "x", role: "retailer" } as any);
    const token = jwt.sign({ id: user._id.toString(), role: "retailer" }, process.env.JWT_SECRETS || "test-secret", {
      expiresIn: "1d",
    });

    const res = await request(app).put(`/api/retailers/auth/${user._id}/profile-picture`).set("Authorization", `Bearer ${token}`);
    if (res.status !== 400) console.error("update profile picture failed body:", res.body);
    expect(res.status).toBe(400);
  });
});
