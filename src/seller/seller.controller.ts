import { Controller, UseGuards, Post, Body, Param, ParseIntPipe, Query, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SellerJwtAuthGuard } from 'src/auth/guards/seller.jwt.guard';
import { UserId } from 'src/util/decorator/userId.decorator';
import { CreateProductBundleDto } from './dto/create.product.bundle.dto';
import { CreateProductDto } from './dto/create.product.dto';
import { CreateProductOptionsDto } from './dto/create.product.options.dto';
import { GetProductBundleDto } from './dto/get.product.bundle.dto';
import { GetProductDto } from './dto/get.product.dto';
import { GetProductOptionDto } from './dto/get.product.options.dto';
import { GetProductRequiredOptionDto } from './dto/get.product.required.option.dto';
import { IsRequireOptionDto } from './dto/is.require.option.dto';
import { SellerService } from './seller.service';

@Controller('seller')
@ApiTags('Seller API')
@UseGuards(SellerJwtAuthGuard) // seller 로그인 후 접속가능
export class SellerController {
  constructor(private readonly sellerservice: SellerService) {}

  @Post('/product-bundle')
  @ApiOperation({ summary: '묶음 배송 그룹 등록 API', description: 'seller는 묶음 배송 그룹을 등록할 수 있다.' })
  async createProductBundle(
    @UserId() sellerId: number,
    @Body() createProductBundleDto: CreateProductBundleDto,
  ): Promise<GetProductBundleDto> {
    return await this.sellerservice.createProductBundle(sellerId, createProductBundleDto);
  }

  @HttpCode(201)
  @Post('/product')
  @ApiOperation({ summary: 'product 등록 API', description: 'seller는 상품을 등록할 수 있다.' })
  async createProduct(@UserId() sellerId: number, @Body() createProductDto: CreateProductDto) {
    const product = await this.sellerservice.createProduct(sellerId, createProductDto);
    return { data: product };
  }

  @Post('/product/:id/options')
  @ApiOperation({
    summary: 'product 옵션, 선택옵션 등록 API',
    description: 'seller는 상품의 옵션과 선택 옵션을 등록할 수 있다.',
  })
  async createProductOptions(
    @UserId() sellerId: number,
    @Param('id', ParseIntPipe) productId: number,
    @Query() isRequireOptionDto: IsRequireOptionDto,
    @Body() createProductOptionsDto: CreateProductOptionsDto,
  ): Promise<GetProductRequiredOptionDto | GetProductOptionDto> {
    return await this.sellerservice.createProductOptions(
      sellerId,
      productId,
      isRequireOptionDto,
      createProductOptionsDto,
    );
  }
}
