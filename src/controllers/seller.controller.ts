import { Controller, UseGuards, HttpCode, Post, Body, Param, ParseIntPipe, Query, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SellerJwtAuthGuard } from 'src/auth/guards/seller-jwt.guard';
import { UserId } from 'src/decorators/user-id.decorator';
import { CreateProductBundleDto } from 'src/dtos/create-product-bundle.dto';
import { CreateProductOptionsDto } from 'src/dtos/create-product-options.dto';
import { CreateProductDto } from 'src/dtos/create-product.dto';
import { GetPaginationDto } from 'src/dtos/get-pagination.dto';
import { IsRequireOptionDto } from 'src/dtos/is-require-options.dto';
import { PaginationDto } from 'src/dtos/pagination.dto';
import { ProductBundleDto } from 'src/dtos/product-bundle.dto';
import { ProductOptionDto } from 'src/dtos/product-option.dto';
import { ProductRequiredOptionDto } from 'src/dtos/product-required-option.dto';
import { ProductDto } from 'src/dtos/product.dto';
import { SellerService } from 'src/services/seller.service';
import { createPaginationResponseDto } from 'src/util/functions/pagination-util.function';

@Controller('seller')
@ApiBearerAuth('token')
@ApiTags('Seller API')
@UseGuards(SellerJwtAuthGuard) // seller 로그인 후 접속가능
export class SellerController {
  constructor(private readonly sellerservice: SellerService) {}

  @Get('/product-bundle')
  @ApiOperation({
    summary: '묶음 배송 그룹 조회 API',
    description: 'seller는 등록한 묶음 배송 그룹을 페이지 네이션으로 조회할 수 있다.',
  })
  async getProductBundles(
    @UserId() sellerId: number,
    @Query() getPaginationDto: GetPaginationDto,
  ): Promise<PaginationDto<ProductBundleDto>> {
    const paginationResponse = await this.sellerservice.getProductBundles(sellerId, getPaginationDto);
    return createPaginationResponseDto(paginationResponse);
  }

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
