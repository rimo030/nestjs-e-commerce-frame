import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SellerJwtAuthGuard } from 'src/auth/guards/seller.jwt.guard';
import { CreateProductBundleDto } from 'src/entities/dtos/create-product-bundle.dto';
import { CreateProductDto } from 'src/entities/dtos/create-product.dto';
import { SellerService } from 'src/services/sellers.service';

@Controller('seller')
@ApiTags('Seller API')
@UseGuards(SellerJwtAuthGuard) // seller 로그인 후 접속가능
export class SellerController {
  constructor(private readonly sellerservice: SellerService) {}

  @Post('/product-bundle')
  @ApiOperation({ summary: '묶음 배송 등록 API', description: 'seller는 묶음배송을 등록할 수 있다.' })
  async createProductBundle(@Body() createProductBundleDto: CreateProductBundleDto): Promise<void> {
    await this.sellerservice.createProductBundle(createProductBundleDto);
  }

  @Post('/product')
  @ApiOperation({ summary: 'product 등록 API', description: 'seller는 상품을 등록할 수 있다.' })
  async createProduct(@Body() createProductDto: CreateProductDto): Promise<void> {
    await this.sellerservice.createProduct(createProductDto);
  }
}
