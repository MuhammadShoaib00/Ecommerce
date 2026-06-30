import { Module } from '@nestjs/common';
import { ProductsAdminController } from './products.admin.controller';
import { OrdersAdminController } from './orders.admin.controller';
import { ProductsModule } from '../products/products.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [ProductsModule, OrdersModule],
  controllers: [ProductsAdminController, OrdersAdminController],
})
export class AdminModule {}
