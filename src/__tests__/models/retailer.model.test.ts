import mongoose from "mongoose";
import { RetailerModel, IRetailer } from "../../models/retailer.model";

afterEach(async () => {
  await RetailerModel.deleteMany({});
});

describe("Retailer Model", () => {
  it("should create a retailer with all required fields", async () => {
    const retailerData: IRetailer = {
      authId: new mongoose.Types.ObjectId(),
      ownerName: "John Doe",
      organizationName: "Doe Inc.",
      username: "johndoe",
      phoneNumber: "1234567890",
    } as IRetailer;

    const retailer = new RetailerModel(retailerData);
    const savedRetailer = await retailer.save();

    expect(savedRetailer._id).toBeDefined();
    expect(savedRetailer.ownerName).toBe(retailerData.ownerName);
    expect(savedRetailer.organizationName).toBe(retailerData.organizationName);
    expect(savedRetailer.username).toBe(retailerData.username);
    expect(savedRetailer.phoneNumber).toBe(retailerData.phoneNumber);
  });

  it("should fail to create a retailer with a duplicate username", async () => {
    const retailerData1 = {
      authId: new mongoose.Types.ObjectId(),
      ownerName: "John Doe",
      organizationName: "Doe Inc.",
      username: "testuser",
      phoneNumber: "1234567890",
    };
    const retailer1 = new RetailerModel(retailerData1);
    await retailer1.save();

    const retailerData2 = {
      authId: new mongoose.Types.ObjectId(),
      ownerName: "Jane Doe",
      organizationName: "Doe Corp.",
      username: "testuser",
      phoneNumber: "0987654321",
    };
    const retailer2 = new RetailerModel(retailerData2);

    await expect(retailer2.save()).rejects.toThrow();
  });

  it("should fail to create a retailer without required fields", async () => {
    const retailerData = {
      ownerName: "John Doe",
      // Missing authId, organizationName, username
    };
    const retailer = new RetailerModel(retailerData);

    await expect(retailer.save()).rejects.toThrow();
  });
});
