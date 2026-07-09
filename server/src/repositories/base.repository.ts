import type { Model, Document, UpdateQuery, AnyObject } from 'mongoose';

export class BaseRepository<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    const entity = new this.model(data);
    return entity.save();
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async findOne(filter: AnyObject): Promise<T | null> {
    return this.model.findOne(filter).exec();
  }

  async find(filter: AnyObject): Promise<T[]> {
    return this.model.find(filter).exec();
  }

  async update(id: string, data: UpdateQuery<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async count(filter: AnyObject): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }
}
