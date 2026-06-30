import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe';

@ApiTags('cart')
@ApiBearerAuth()
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@CurrentUser() user: { userId: string }): Promise<any> {
    return this.cartService.getCart(user.userId);
  }

  @Post('items')
  addItem(
    @CurrentUser() user: { userId: string },
    @Body() dto: AddToCartDto,
  ): Promise<any> {
    return this.cartService.addItem(user.userId, dto);
  }

  @Patch('items/:productId')
  updateItem(
    @CurrentUser() user: { userId: string },
    @Param('productId', ParseObjectIdPipe) productId: string,
    @Body() dto: UpdateCartItemDto,
  ): Promise<any> {
    return this.cartService.updateItem(user.userId, productId, dto);
  }

  @Delete('items/:productId')
  removeItem(
    @CurrentUser() user: { userId: string },
    @Param('productId', ParseObjectIdPipe) productId: string,
  ): Promise<any> {
    return this.cartService.removeItem(user.userId, productId);
  }

  @Delete()
  clearCart(@CurrentUser() user: { userId: string }): Promise<any> {
    return this.cartService.clearCart(user.userId);
  }
}
