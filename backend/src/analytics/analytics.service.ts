import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../orders/schemas/order.schema';
import { OrderStatus } from '../common/enums/order-status.enum';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
  ) {}

  async getDashboard() {
    const [totalSalesResult, ordersByStatus, topProducts] = await Promise.all([
      this.orderModel.aggregate([
        { $match: { status: { $ne: OrderStatus.CANCELLED } } },
        {
          $group: {
            _id: null,
            totalSales: { $sum: '$totalAmount' },
            orderCount: { $sum: 1 },
          },
        },
      ]),
      this.orderModel.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      this.orderModel.aggregate([
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.productId',
            name: { $first: '$items.name' },
            totalRevenue: {
              $sum: { $multiply: ['$items.price', '$items.quantity'] },
            },
            totalQuantity: { $sum: '$items.quantity' },
          },
        },
        { $sort: { totalRevenue: -1 } },
        { $limit: 10 },
      ]),
    ]);

    const statusMap = Object.fromEntries(
      ordersByStatus.map((r: any) => [r._id, r.count]),
    );

    return {
      totalSales: totalSalesResult[0]?.totalSales ?? 0,
      totalOrders: totalSalesResult[0]?.orderCount ?? 0,
      ordersByStatus: statusMap,
      topProducts,
    };
  }
}
