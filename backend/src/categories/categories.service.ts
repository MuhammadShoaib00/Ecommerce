import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  findAll(): Promise<any[]> {
    return this.categoryModel.find().sort({ name: 1 }).lean().exec();
  }

  findById(id: string): Promise<any> {
    return this.categoryModel.findById(id).lean().exec();
  }
}
