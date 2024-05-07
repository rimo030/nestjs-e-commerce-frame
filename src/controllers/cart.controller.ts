import { Body, Controller, Get, HttpCode, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BuyerJwtAuthGuard } from 'src/auth/guards/buyer-jwt.guard';
import { UserId } from 'src/decorators/user-id.decorator';
import { CartGroupByProductBundleDto } from 'src/entities/dtos/cart-group-by-product-bundle.dto';
import { CartDto } from 'src/entities/dtos/cart.dto';
import { CreateCartDto } from 'src/entities/dtos/create-cart.dto';
import { UpdateCartOptionCountDto } from 'src/entities/dtos/update-cart-option-count.dto';
import { UpdateCartDto } from 'src/entities/dtos/update-cart.dto';
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
  async addCart(
    @UserId() buyerId: number,
    @Body() createCartDto: CreateCartDto,
  ): Promise<{
    data: CartDto | UpdateCartDto;
  }> {
    const cart = await this.cartService.addCart(buyerId, createCartDto);
    return { data: cart };
  }

  @Get()
  @ApiOperation({ summary: '장바구니 조회 API', description: '모든 사용자는 담은 상품을 장바구니에서 조회할 수 있다.' })
  async readCarts(@UserId() buyerId: number): Promise<{
    data: CartGroupByProductBundleDto[];
  }> {
    const cartDetils = await this.cartService.readCarts(buyerId);
    return { data: cartDetils };
  }

  @Patch()
  @ApiOperation({
    summary: '장바구니 옵션 수량 변경 API',
    description: '모든 사용자는 담은 상품 옵션의 수량을 변경 할 수 있다.',
  })
  async updateCartsOptionCount(
    @UserId() buyerId: number,
    @Body() updateCartOptionCountDto: UpdateCartOptionCountDto,
  ): Promise<{ data: number }> {
    const result = await this.cartService.updateCartsOptionCount(buyerId, updateCartOptionCountDto);
    return { data: result };
  }
}
