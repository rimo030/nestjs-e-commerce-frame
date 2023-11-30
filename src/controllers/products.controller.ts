import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetProductDto } from 'src/entities/dtos/get-product.dto';
import { ProductEntity } from 'src/entities/product.entity';
import { ProductService } from 'src/services/products.service';

@Controller('products')
@ApiTags('Product API')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/:id')
  @ApiOperation({ summary: '상품 상세 조회 API', description: '등록된 상품의 정보를 확인할 수 있다.' })
  async getProduct(@Param() ProductId: number) {
    await this.productService.getProduct(ProductId);
  }

  //  products?page=1&limit=15&category=&seller=&
  @Get()
  @ApiOperation({ summary: '상품 리스트 조회 API', description: '모든 사용자는 등록된 상품 리스트를 확인할 수 있다.' })
  async getProductList(@Query() params: GetProductDto): Promise<ProductEntity[] | null> {
    return await this.productService.getProductList(params);
  }
}
