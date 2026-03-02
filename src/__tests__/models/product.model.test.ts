import mongoose, { Types } from "mongoose";
import { ProductModel, IProduct } from "../../models/product.model";

describe("Product Model", () => {
  afterEach(async () => {
    await ProductModel.deleteMany({});
  });

  it("should create a product with all required fields", async () => {
    const productData = {
      title: "Test Product",
      retailerAuthId: new mongoose.Types.ObjectId(),
    } as IProduct;

    const product = new ProductModel(productData);
    const savedProduct = await product.save();

    expect(savedProduct._id).toBeDefined();
    expect(savedProduct.title).toBe(productData.title);
    expect(savedProduct.retailerAuthId).toBe(productData.retailerAuthId);
  });

  it("should fail to create a product without required fields", async () => {
    const productData = {
      // Missing title and retailerAuthId
    };
    const product = new ProductModel(productData);

    await expect(product.save()).rejects.toThrow();
  });

  it("should default noOfLikes to 0", async () => {
    const productData = {
      title: "Test Product",
      retailerAuthId: new mongoose.Types.ObjectId(),
    } as IProduct;

    const product = new ProductModel(productData);
    const savedProduct = await product.save();

    expect(savedProduct.noOfLikes).toBe(0);
  });

  it("should allow updating likes and noOfLikes", async () => {
    const productData = {
      title: "Test Product",
      retailerAuthId: new mongoose.Types.ObjectId(),
    } as IProduct;

    const product = new ProductModel(productData);
    const savedProduct = await product.save();

    savedProduct.likes.push("user1");
    savedProduct.noOfLikes = 1;
    const updatedProduct = await savedProduct.save();

    expect(updatedProduct.likes).toContain("user1");
    expect(updatedProduct.noOfLikes).toBe(1);
  });
});
