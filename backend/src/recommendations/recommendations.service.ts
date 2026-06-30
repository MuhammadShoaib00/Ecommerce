import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { Order, OrderDocument } from '../orders/schemas/order.schema';

const RECOMMENDATION_LIMIT = 10;

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
  ) {}

  async getRecommendations(userId?: string): Promise<any[]> {
    if (userId) {
      const affinityResults = await this.getAffinityRecommendations(userId);
      if (affinityResults.length >= 4) return affinityResults;
    }
    return this.getFallbackRecommendations();
  }

  private async getAffinityRecommendations(userId: string): Promise<any[]> {
    const userOrders = await this.orderModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()
      .exec();

    if (!userOrders.length) return [];

    const orderedProductIds = userOrders.flatMap((o) =>
      o.items.map((i) => i.productId),
    );

    const orderedProducts = await this.productModel
      .find({ _id: { $in: orderedProductIds } }, { category: 1 })
      .lean()
      .exec();

    const categoryCounts = new Map<string, number>();
    for (const p of orderedProducts) {
      if (!p.category) continue;
      const key = p.category.toString();
      categoryCounts.set(key, (categoryCounts.get(key) ?? 0) + 1);
    }

    if (!categoryCounts.size) return [];

    const topCategories = [...categoryCounts.entries()]
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([catId]) => new Types.ObjectId(catId));

    return this.productModel
      .find({
        category: { $in: topCategories },
        _id: { $nin: orderedProductIds },
        stockQuantity: { $gt: 0 },
      })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(RECOMMENDATION_LIMIT)
      .lean()
      .exec();
  }

  private async getFallbackRecommendations(): Promise<any[]> {
    const pipeline = [
      { $unwind: '$items' },
      { $group: { _id: '$items.productId', totalSold: { $sum: '$items.quantity' } } },
      { $sort: { totalSold: -1 as const } },
      { $limit: RECOMMENDATION_LIMIT },
    ];

    const topSold = await this.orderModel.aggregate(pipeline);
    if (topSold.length > 0) {
      const topIds = topSold.map((r) => r._id);
      const products = await this.productModel
        .find({ _id: { $in: topIds }, stockQuantity: { $gt: 0 } })
        .populate('category', 'name slug')
        .lean()
        .exec();
      if (products.length > 0) return products;
    }

    return this.productModel
      .find({ stockQuantity: { $gt: 0 } })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(RECOMMENDATION_LIMIT)
      .lean()
      .exec();
  }
}
