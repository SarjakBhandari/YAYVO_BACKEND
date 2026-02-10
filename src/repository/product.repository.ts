import { ProductModel, IProduct } from '../models/product.model';

export class ProductRepository {
  async create(data: Partial<IProduct>): Promise<IProduct> {
    const p = new ProductModel(data);
    return p.save();
  }

  async findById(id: string): Promise<IProduct | null> {
    return ProductModel.findById(id).exec();
  }

  async findAll(filter = {}, page = 1, size = 10) {
    const skip = (page - 1) * size;
    const [items, total] = await Promise.all([
      ProductModel.find(filter).skip(skip).limit(size).exec(),
      ProductModel.countDocuments(filter).exec()
    ]);
    return { items, total };
  }

  async update(id: string, data: Partial<IProduct>) {
    return ProductModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string) {
    return ProductModel.findByIdAndDelete(id).exec();
  }
}
