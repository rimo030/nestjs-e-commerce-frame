import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BuyerJwtAuthGuard } from 'src/auth/guards/buyer-jwt.guard';
import { UserId } from 'src/decorators/user-id.decorator';
import { CartDto } from 'src/entities/dtos/cart.dto';
import { CreateCartDto } from 'src/entities/dtos/create-cart.dto';
import { CartService } from 'src/services/cart.service';

@Controller('cart')
@ApiBearerAuth('token')
@ApiTags('Cart API')
@UseGuards(BuyerJwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @HttpCode(201)
  @Post()
  @ApiOperation({ summary: '장바구니 추가 API', description: '모든 사용자는 장바구니에 상품을 담을 수 있다.' })
  async addCart(@UserId() buyerId: number, @Body() createCartDto: CreateCartDto): Promise<{ data: CartDto }> {
    const cart = await this.cartService.addCart(buyerId, createCartDto);
    return { data: cart };
  }
}
