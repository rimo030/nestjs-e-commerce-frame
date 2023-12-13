import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductPaginationDto } from 'src/entities/dtos/product-pagination.dto';
import { GetProductResponse } from 'src/interfaces/get-product-response.interface';
import { ProductService } from 'src/services/product.service';
import { createProductPaginationForm } from 'src/util/functions/create-product-pagination-form.function';

@Controller('products')
@ApiTags('Product API')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/:id')
  @ApiOperation({ summary: '상품 상세 조회 API', description: '등록된 상품의 정보를 확인할 수 있다.' })
  async getProduct(@Param() ProductId: number) {
    await this.productService.getProduct(ProductId);
  }

  @Get()
  @ApiOperation({ summary: '상품 리스트 조회 API', description: '모든 사용자는 등록된 상품 리스트를 확인할 수 있다.' })
  async getProductList(@Query() productPaginationDto: ProductPaginationDto): Promise<GetProductResponse> {
    const response = await this.productService.getProductList(productPaginationDto);
    return createProductPaginationForm(response, productPaginationDto);
  }
}
