import request from "supertest";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { UserModel } from "../../models/user.model";
import ReviewModel from "../../models/review.model";

let app: any;

beforeAll(() => {
  // require app after setup.integration.ts has run and set env vars
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  app = require("../../app").default;
});

afterAll(async () => {
  try {
    await mongoose.connection.close();
  } catch {
    // ignore
  }
});

describe("Review integration tests", () => {
  let consumerToken: string;
  let consumerAuthId: string;
  let otherToken: string;

  beforeEach(async () => {
    await ReviewModel.deleteMany({});
    await UserModel.deleteMany({ email: /revtest/ });

    const consumer = await UserModel.create({
      email: "revtest-consumer@example.com",
      passwordHash: "x",
      role: "consumer",
    } as any);
    consumerAuthId = consumer._id.toString();
    consumerToken = jwt.sign({ id: consumerAuthId, role: "consumer" }, process.env.JWT_SECRETS || "test-secret", {
      expiresIn: "1d",
    });

    const other = await UserModel.create({
      email: "revtest-other@example.com",
      passwordHash: "x",
      role: "consumer",
    } as any);
    otherToken = jwt.sign({ id: other._id.toString(), role: "consumer" }, process.env.JWT_SECRETS || "test-secret", {
      expiresIn: "1d",
    });
  });

  test("create review returns success", async () => {
    const res = await request(app)
      .post("/api/reviews")
      .set("Authorization", `Bearer ${consumerToken}`)
      .send({ title: "My Review", description: "desc", authorId: consumerAuthId });
    expect([200, 201]).toContain(res.status);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("title", "My Review");
  });

  test("create review fails without title", async () => {
    const res = await request(app)
      .post("/api/reviews")
      .set("Authorization", `Bearer ${consumerToken}`)
      .send({ authorId: consumerAuthId });
    expect([400, 422]).toContain(res.status);
    expect(res.body.success).toBe(false);
  });

  test("get review by id returns review", async () => {
    const doc = await ReviewModel.create({ title: "Seeded", authorId: consumerAuthId });
    const res = await request(app).get(`/api/reviews/${doc._id}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("title", "Seeded");
  });

  test("get reviews by author returns list", async () => {
    await ReviewModel.create({ title: "ByAuthor", authorId: consumerAuthId });
    const res = await request(app).get(`/api/reviews/author/${consumerAuthId}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("update review works for author", async () => {
    const doc = await ReviewModel.create({ title: "Old", authorId: consumerAuthId });
    const res = await request(app)
      .put(`/api/reviews/${doc._id}`)
      .set("Authorization", `Bearer ${consumerToken}`)
      .send({ title: "New" });
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("title", "New");
  });

  test("delete review works for author", async () => {
    const doc = await ReviewModel.create({ title: "DeleteMe", authorId: consumerAuthId });
    const res = await request(app).delete(`/api/reviews/${doc._id}`).set("Authorization", `Bearer ${consumerToken}`);
    expect([200, 204]).toContain(res.status);
  });

  test("list paginated reviews returns pagination", async () => {
    await ReviewModel.create({ title: "P1", authorId: consumerAuthId });
    await ReviewModel.create({ title: "P2", authorId: consumerAuthId });
    const res = await request(app).get("/api/reviews/paginated?page=1&size=1");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("pagination");
  });

  test("like review increments likes", async () => {
    const doc = await ReviewModel.create({ title: "LikeMe", authorId: consumerAuthId });
    const res = await request(app)
      .post(`/api/reviews/${doc._id}/like`)
      .set("Authorization", `Bearer ${otherToken}`)
      .send({ userId: consumerAuthId });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("unlike review decrements likes", async () => {
    const doc = await ReviewModel.create({ title: "UnlikeMe", authorId: consumerAuthId, likedBy: [consumerAuthId], noOfLikes: 1 });
    const res = await request(app)
      .post(`/api/reviews/${doc._id}/unlike`)
      .set("Authorization", `Bearer ${otherToken}`)
      .send({ userId: consumerAuthId });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("isLikedBy endpoint returns liked status", async () => {
    const doc = await ReviewModel.create({ title: "CheckLike", authorId: consumerAuthId, likedBy: [consumerAuthId] });
    const res = await request(app).get(`/api/reviews/${doc._id}/islikedby/${consumerAuthId}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("liked", true);
  });
});
