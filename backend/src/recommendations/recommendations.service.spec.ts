import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { RecommendationsService } from './recommendations.service';
import { Product } from '../products/schemas/product.schema';
import { Order } from '../orders/schemas/order.schema';

const makeChain = (result: any) => {
  const chain: any = {
    sort: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnThis(),
    lean: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(result),
  };
  return chain;
};

describe('RecommendationsService', () => {
  let service: RecommendationsService;

  const mockProductModel = { find: jest.fn(), aggregate: jest.fn() };
  const mockOrderModel = { find: jest.fn(), aggregate: jest.fn() };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecommendationsService,
        { provide: getModelToken(Product.name), useValue: mockProductModel },
        { provide: getModelToken(Order.name), useValue: mockOrderModel },
      ],
    }).compile();

    service = module.get<RecommendationsService>(RecommendationsService);
  });

  describe('getRecommendations()', () => {
    it('falls back to top sellers when user has no order history', async () => {
      const userId = new Types.ObjectId().toString();
      const topProductId = new Types.ObjectId();
      const topProduct = { _id: topProductId, name: 'Popular', price: 100, stockQuantity: 5 };

      // User has no orders
      mockOrderModel.find.mockReturnValue(makeChain([]));

      // Aggregate returns top-sold product id
      mockOrderModel.aggregate.mockResolvedValue([{ _id: topProductId, totalSold: 10 }]);

      // productModel.find for top products returns the product
      mockProductModel.find.mockReturnValue(makeChain([topProduct]));

      const results = await service.getRecommendations(userId);
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Popular');
    });

    it('falls back to newest in-stock products when aggregate returns empty', async () => {
      const newest = [{ _id: new Types.ObjectId(), name: 'Latest', price: 200, stockQuantity: 3 }];

      // No userId — goes straight to fallback
      mockOrderModel.aggregate.mockResolvedValue([]);
      mockProductModel.find.mockReturnValue(makeChain(newest));

      const results = await service.getRecommendations();
      expect(results).toEqual(newest);
    });

    it('returns affinity-based products when user has 4+ matching products', async () => {
      const userId = new Types.ObjectId().toString();
      const categoryId = new Types.ObjectId();
      const orderedProductId = new Types.ObjectId();

      const affinityProducts = Array.from({ length: 5 }, () => ({
        _id: new Types.ObjectId(),
        name: 'Affinity Product',
        price: 500,
        stockQuantity: 4,
        category: categoryId,
      }));

      // 1. orderModel.find returns an order with one item
      mockOrderModel.find.mockReturnValue(
        makeChain([{ items: [{ productId: orderedProductId, quantity: 1 }] }]),
      );

      // 2. productModel.find called twice: once for categories, once for affinity
      mockProductModel.find
        .mockReturnValueOnce(makeChain([{ _id: orderedProductId, category: categoryId }]))
        .mockReturnValueOnce(makeChain(affinityProducts));

      const results = await service.getRecommendations(userId);
      expect(results.length).toBeGreaterThanOrEqual(4);
    });

    it('falls through to fallback when affinity returns fewer than 4 results', async () => {
      const userId = new Types.ObjectId().toString();
      const topProductId = new Types.ObjectId();

      // Order model: no orders
      mockOrderModel.find.mockReturnValue(makeChain([]));

      // Fallback: aggregate returns 1 top-seller
      mockOrderModel.aggregate.mockResolvedValue([{ _id: topProductId, totalSold: 5 }]);

      const topProduct = { _id: topProductId, name: 'BestSeller', price: 300, stockQuantity: 2 };
      mockProductModel.find.mockReturnValue(makeChain([topProduct]));

      const results = await service.getRecommendations(userId);
      expect(results[0].name).toBe('BestSeller');
    });
  });
});
