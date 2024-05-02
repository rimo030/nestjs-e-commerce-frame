import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { GetProductListPaginationDto } from 'src/entities/dtos/get-product-list-pagination.dto';
import { IsRequireOptionDto } from 'src/entities/dtos/is-require-options.dto';
import { PaginationResponseDto } from 'src/entities/dtos/pagination-response.dto';
import { PaginationDto } from 'src/entities/dtos/pagination.dto';
import { ProductAllOptionsDto } from 'src/entities/dtos/product-all-options.dto';
import { ProductListDto } from 'src/entities/dtos/product-list.dto';
import { ProductOptionDto } from 'src/entities/dtos/product-option.dto';
import { ProductRequiredOptionJoinInputOptionDto } from 'src/entities/dtos/product-rquired-option-join-input-option.dto';
import { ProductService } from 'src/services/product.service';

@Controller('products')
@ApiTags('Product API')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Get('/:id/options')
  @ApiOperation({
    summary: '상품 필수/선택 옵션 조회 API',
    description: '등록된 상품의 필수/선택 옵션을 페이지네이션으로 조회할 수 있다.',
  })
  async getProductOptions(
    @Param('id', ParseIntPipe) productId: number,
    @Query() isRequireOptionDto: IsRequireOptionDto,
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginationResponseDto<ProductRequiredOptionJoinInputOptionDto | ProductOptionDto>> {
    return await this.productService.getProductOption(productId, isRequireOptionDto, paginationDto);
  }

  @Get('/:id')
  @ApiOperation({ summary: '상품 상세 조회 API', description: '등록된 상품과 옵션의 정보를 확인할 수 있다.' })
  async getProduct(@Param('id', ParseIntPipe) id: number): Promise<{ data: ProductAllOptionsDto }> {
    const productAllOption = await this.productService.getProduct(id);
    return { data: productAllOption };
  }

  @Get()
  @ApiOperation({
    summary: '상품 리스트 조회 API',
    description: '모든 사용자는 등록된 상품들의 리스트를 페이지네이션으로 조회할 수 있다.',
  })
  async getProductList(
    @Query() getProductListPaginationDto: GetProductListPaginationDto,
  ): Promise<PaginationResponseDto<ProductListDto>> {
    return await this.productService.getProductListWithMiniumPrice(getProductListPaginationDto);
  }
}
