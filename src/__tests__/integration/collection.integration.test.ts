/**
 * src/__tests__/integration/collection.integration.test.ts
 *
 * This integration test suite mocks the CollectionService so tests run
 * end-to-end against your Express app without touching the DB or models.
 *
 * Important: mock must be declared before importing the app so controllers
 * pick up the mocked service.
 */

import { jest } from "@jest/globals";

/* Mock CollectionService before importing app so controllers use the mock */
jest.mock("../../services/collection.service", () => {
  // In-memory store keyed by consumerAuthId
  const store: Record<string, { savedReviews: string[]; savedProducts: string[] }> = {};

  const ensureAuth = (authId?: string) => {
    if (!authId) {
      const err: any = new Error("consumerAuthId required");
      err.status = 400;
      throw err;
    }
  };

  return {
    CollectionService: {
      // Save review: ensure reviewId exists (we treat any string as valid)
      saveReview: async (authId: string, reviewId: string) => {
        ensureAuth(authId);
        if (!reviewId) {
          const err: any = new Error("reviewId required");
          err.status = 400;
          throw err;
        }
        if (!store[authId]) store[authId] = { savedReviews: [], savedProducts: [] };
        if (!store[authId].savedReviews.includes(reviewId)) store[authId].savedReviews.push(reviewId);
        return store[authId];
      },

      unsaveReview: async (authId: string, reviewId: string) => {
        ensureAuth(authId);
        if (!reviewId) {
          const err: any = new Error("reviewId required");
          err.status = 400;
          throw err;
        }
        if (!store[authId]) return { savedReviews: [], savedProducts: [] };
        store[authId].savedReviews = store[authId].savedReviews.filter((id) => id !== reviewId);
        return store[authId];
      },

      saveProduct: async (authId: string, productId: string) => {
        ensureAuth(authId);
        if (!productId) {
          const err: any = new Error("productId required");
          err.status = 400;
          throw err;
        }
        if (!store[authId]) store[authId] = { savedReviews: [], savedProducts: [] };
        if (!store[authId].savedProducts.includes(productId)) store[authId].savedProducts.push(productId);
        return store[authId];
      },

      unsaveProduct: async (authId: string, productId: string) => {
        ensureAuth(authId);
        if (!productId) {
          const err: any = new Error("productId required");
          err.status = 400;
          throw err;
        }
        if (!store[authId]) return { savedReviews: [], savedProducts: [] };
        store[authId].savedProducts = store[authId].savedProducts.filter((id) => id !== productId);
        return store[authId];
      },

      getSavedReviewsPaginated: async (authId: string, page = 1, size = 10) => {
        if (!store[authId]) return { items: [], pagination: { page, size, totalItems: 0, totalPages: 1 } };
        const ids = store[authId].savedReviews;
        const totalItems = ids.length;
        const totalPages = Math.max(1, Math.ceil(totalItems / size));
        const slice = ids.slice((page - 1) * size, page * size);
        const items = slice.map((id) => ({ _id: id }));
        return { items, pagination: { page, size, totalItems, totalPages } };
      },

      getSavedProductsPaginated: async (authId: string, page = 1, size = 10) => {
        if (!store[authId]) return { items: [], pagination: { page, size, totalItems: 0, totalPages: 1 } };
        const ids = store[authId].savedProducts;
        const totalItems = ids.length;
        const totalPages = Math.max(1, Math.ceil(totalItems / size));
        const slice = ids.slice((page - 1) * size, page * size);
        const items = slice.map((id) => ({ _id: id }));
        return { items, pagination: { page, size, totalItems, totalPages } };
      },

      // Helper for tests to reset store
      __resetStore: () => {
        for (const k of Object.keys(store)) delete store[k];
      },
    },
  };
});

/* Now import app and supertest */
import request from "supertest";
import app from "../../app";
import { CollectionService as MockedCollectionService } from "../../services/collection.service";

describe("Collection Integration Tests (mocked CollectionService)", () => {
  const consumerAuthId = "testUser123";
  const reviewId1 = "rev1";
  const reviewId2 = "rev2";
  const productId1 = "prod1";
  const productId2 = "prod2";

  beforeEach(() => {
    // Reset in-memory store inside the mocked service
    if ((MockedCollectionService as any).__resetStore) (MockedCollectionService as any).__resetStore();
  });

  // ---------------- Save Review ----------------
  describe("POST /api/collections/review/save", () => {
    test("should save a new review", async () => {
      const response = await request(app)
        .post("/api/collections/review/save")
        .send({ consumerAuthId, reviewId: reviewId1 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body.data.savedReviews).toContain(reviewId1);
    });

    test("should be idempotent when saving same review twice", async () => {
      await request(app).post("/api/collections/review/save").send({ consumerAuthId, reviewId: reviewId1 });
      const response = await request(app).post("/api/collections/review/save").send({ consumerAuthId, reviewId: reviewId1 });

      expect(response.status).toBe(200);
      expect(response.body.data.savedReviews.filter((id: string) => id === reviewId1).length).toBe(1);
    });

    test("should fail with missing consumerAuthId", async () => {
      const response = await request(app).post("/api/collections/review/save").send({ reviewId: reviewId1 });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("success", false);
      expect(response.body.message).toMatch(/consumerAuthId/);
    });
  });

  // ---------------- Unsave Review ----------------
  describe("POST /api/collections/review/unsave", () => {
    test("should unsave an existing review", async () => {
      await request(app).post("/api/collections/review/save").send({ consumerAuthId, reviewId: reviewId1 });
      const response = await request(app).post("/api/collections/review/unsave").send({ consumerAuthId, reviewId: reviewId1 });

      expect(response.status).toBe(200);
      expect(response.body.data.savedReviews).not.toContain(reviewId1);
    });

    test("should be idempotent when unsaving twice", async () => {
      await request(app).post("/api/collections/review/unsave").send({ consumerAuthId, reviewId: reviewId1 });
      const response = await request(app).post("/api/collections/review/unsave").send({ consumerAuthId, reviewId: reviewId1 });

      expect(response.status).toBe(200);
    });
  });

  // ---------------- Save Product ----------------
  describe("POST /api/collections/product/save", () => {
    test("should save a new product", async () => {
      const response = await request(app).post("/api/collections/product/save").send({ consumerAuthId, productId: productId1 });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("success", true);
      expect(response.body.data.savedProducts).toContain(productId1);
    });

    test("should be idempotent when saving same product twice", async () => {
      await request(app).post("/api/collections/product/save").send({ consumerAuthId, productId: productId1 });
      const response = await request(app).post("/api/collections/product/save").send({ consumerAuthId, productId: productId1 });

      expect(response.status).toBe(200);
      expect(response.body.data.savedProducts.filter((id: string) => id === productId1).length).toBe(1);
    });

    test("should fail with missing productId", async () => {
      const response = await request(app).post("/api/collections/product/save").send({ consumerAuthId });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("success", false);
      expect(response.body.message).toMatch(/productId/);
    });
  });

  // ---------------- Unsave Product ----------------
  describe("POST /api/collections/product/unsave", () => {
    test("should unsave an existing product", async () => {
      await request(app).post("/api/collections/product/save").send({ consumerAuthId, productId: productId2 });
      const response = await request(app).post("/api/collections/product/unsave").send({ consumerAuthId, productId: productId2 });

      expect(response.status).toBe(200);
      expect(response.body.data.savedProducts).not.toContain(productId2);
    });

    test("should be idempotent when unsaving twice", async () => {
      await request(app).post("/api/collections/product/unsave").send({ consumerAuthId, productId: productId2 });
      const response = await request(app).post("/api/collections/product/unsave").send({ consumerAuthId, productId: productId2 });

      expect(response.status).toBe(200);
    });
  });

  // ---------------- Get Saved Reviews ----------------
  describe("GET /api/collections/:consumerAuthId/reviews", () => {
    test("should return saved reviews list", async () => {
      await request(app).post("/api/collections/review/save").send({ consumerAuthId, reviewId: reviewId1 });
      const response = await request(app).get(`/api/collections/${consumerAuthId}/reviews?page=1&size=10`);

      expect(response.status).toBe(200);
      expect(response.body.data.items.some((r: any) => r._id === reviewId1)).toBe(true);
    });

    test("should paginate saved reviews", async () => {
      await request(app).post("/api/collections/review/save").send({ consumerAuthId, reviewId: reviewId1 });
      await request(app).post("/api/collections/review/save").send({ consumerAuthId, reviewId: reviewId2 });

      const response = await request(app).get(`/api/collections/${consumerAuthId}/reviews?page=1&size=1`);
      expect(response.status).toBe(200);
      expect(response.body.data.pagination.totalItems).toBeGreaterThanOrEqual(2);
    });
  });

  // ---------------- Get Saved Products ----------------
  describe("GET /api/collections/:consumerAuthId/products", () => {
    test("should return saved products list", async () => {
      await request(app).post("/api/collections/product/save").send({ consumerAuthId, productId: productId1 });
      const response = await request(app).get(`/api/collections/${consumerAuthId}/products?page=1&size=10`);

      expect(response.status).toBe(200);
      expect(response.body.data.items.some((p: any) => p._id === productId1)).toBe(true);
    });

    test("should paginate saved products", async () => {
      await request(app).post("/api/collections/product/save").send({ consumerAuthId, productId: productId1 });
      await request(app).post("/api/collections/product/save").send({ consumerAuthId, productId: productId2 });

      const response = await request(app).get(`/api/collections/${consumerAuthId}/products?page=1&size=1`);
      expect(response.status).toBe(200);
      expect(response.body.data.pagination.totalItems).toBeGreaterThanOrEqual(2);
    });
  });
});
