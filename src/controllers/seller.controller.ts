import { Controller, UseGuards, Post, Body, Param, ParseIntPipe, Query, ParseBoolPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SellerJwtAuthGuard } from 'src/auth/guards/seller-jwt.guard';
import { UserId } from 'src/decorators/user-id.decorator';
import { CreateProductBundleDto } from 'src/entities/dtos/create-product-bundle.dto';
import { CreateProductOptionsDto } from 'src/entities/dtos/create-product-options.dto';
import { CreateProductDto } from 'src/entities/dtos/create-product.dto';
import { GetProductBundleDto } from 'src/entities/dtos/get-product-bundle.dto';
import { GetProductOptionDto } from 'src/entities/dtos/get-product-options.dto';
import { GetProductRequiredOptionDto } from 'src/entities/dtos/get-product-required-option.dto';
import { GetProductDto } from 'src/entities/dtos/get-product.dto';
import { IsRequireOptionDto } from 'src/entities/dtos/is-require-options.dto';
import { ProductOptionEntity } from 'src/entities/product-option.entity';
import { ProductRequiredOptionEntity } from 'src/entities/product-required-option.entity';
import { ProductEntity } from 'src/entities/product.entity';
import { SellerService } from 'src/services/seller.service';

@Controller('seller')
@ApiTags('Seller API')
@UseGuards(SellerJwtAuthGuard) // seller 로그인 후 접속가능
export class SellerController {
  constructor(private readonly sellerservice: SellerService) {}

  @Post('/product-bundle')
  @ApiOperation({ summary: '묶음 배송 그룹 등록 API', description: 'seller는 묶음배송그룹을 등록할 수 있다.' })
  async createProductBundle(
    @UserId() sellerId: number,
    @Body() createProductBundleDto: CreateProductBundleDto,
  ): Promise<GetProductBundleDto> {
    return await this.sellerservice.createProductBundle(sellerId, createProductBundleDto);
  }

  @Post('/product')
  @ApiOperation({ summary: 'product 등록 API', description: 'seller는 상품을 등록할 수 있다.' })
  async createProduct(@UserId() sellerId: number, @Body() createProductDto: CreateProductDto): Promise<GetProductDto> {
    return await this.sellerservice.createProduct(sellerId, createProductDto);
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
