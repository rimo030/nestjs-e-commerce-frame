import { Controller, UseGuards, HttpCode, Post, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SellerJwtAuthGuard } from 'src/auth/guards/seller-jwt.guard';
import { UserId } from 'src/decorators/user-id.decorator';
import { CreateProductBundleDto } from 'src/entities/dtos/create-product-bundle.dto';
import { CreateProductOptionsDto } from 'src/entities/dtos/create-product-options.dto';
import { CreateProductDto } from 'src/entities/dtos/create-product.dto';
import { IsRequireOptionDto } from 'src/entities/dtos/is-require-options.dto';
import { ProductBundleDto } from 'src/entities/dtos/product-bundle.dto';
import { ProductOptionDto } from 'src/entities/dtos/product-option.dto';
import { ProductRequiredOptionDto } from 'src/entities/dtos/product-required-option.dto';
import { ProductDto } from 'src/entities/dtos/product.dto';
import { SellerService } from 'src/services/seller.service';

@Controller('seller')
@ApiBearerAuth('token')
@ApiTags('Seller API')
@UseGuards(SellerJwtAuthGuard) // seller 로그인 후 접속가능
export class SellerController {
  constructor(private readonly sellerservice: SellerService) {}

  @HttpCode(201)
  @Post('/product-bundle')
  @ApiOperation({ summary: '묶음 배송 그룹 등록 API', description: 'seller는 묶음 배송 그룹을 등록할 수 있다.' })
  async createProductBundle(
    @UserId() sellerId: number,
    @Body() createProductBundleDto: CreateProductBundleDto,
  ): Promise<{
    data: ProductBundleDto;
  }> {
    const productBundle = await this.sellerservice.createProductBundle(sellerId, createProductBundleDto);
    return { data: productBundle };
  }

  @HttpCode(201)
  @Post('/product')
  @ApiOperation({ summary: 'product 등록 API', description: 'seller는 상품을 등록할 수 있다.' })
  async createProduct(
    @UserId() sellerId: number,
    @Body() createProductDto: CreateProductDto,
  ): Promise<{
    data: ProductDto;
  }> {
    const product = await this.sellerservice.createProduct(sellerId, createProductDto);
    return { data: product };
  }

  @HttpCode(201)
  @Post('/product/:productId/options')
  @ApiOperation({
    summary: 'product 옵션, 선택옵션 등록 API',
    description: 'seller는 상품의 옵션과 선택 옵션을 등록할 수 있다.',
  })
  async createProductOptions(
    @UserId() sellerId: number,
    @Param('productId', ParseIntPipe) productId: number,
    @Query() isRequireOptionDto: IsRequireOptionDto,
    @Body() createProductOptionsDto: CreateProductOptionsDto,
  ): Promise<{
    data: ProductRequiredOptionDto | ProductOptionDto;
  }> {
    const options = await this.sellerservice.createProductOptions(
      sellerId,
      productId,
      isRequireOptionDto,
      createProductOptionsDto,
    );
    return { data: options };
  }
}
