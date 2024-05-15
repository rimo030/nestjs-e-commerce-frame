import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { GetPaginationDto } from 'src/dtos/get-pagination.dto';
import { GetProductListPaginationDto } from 'src/dtos/get-product-list-pagination.dto';
import { IsRequireOptionDto } from 'src/dtos/is-require-options.dto';
import { PaginationDto } from 'src/dtos/pagination.dto';
import { ProductListDto } from 'src/dtos/product-list.dto';
import { ProductOptionDto } from 'src/dtos/product-option.dto';
import { ProductRequiredOptionJoinInputOptionDto } from 'src/dtos/product-rquired-option-join-input-option.dto';
import { ProductDto } from 'src/dtos/product.dto';
import { ProductService } from 'src/services/product.service';
import { createPaginationResponseDto } from 'src/util/functions/pagination-util.function';

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
    @Query() paginationDto: GetPaginationDto,
  ): Promise<PaginationDto<ProductRequiredOptionJoinInputOptionDto | ProductOptionDto>> {
    const paginationResponse = await this.productService.getProductOption(productId, isRequireOptionDto, paginationDto);
    return createPaginationResponseDto(paginationResponse);
  }

  @Get('/:id')
  @ApiOperation({ summary: '상품 상세 조회 API', description: '등록된 상품의 정보를 확인할 수 있다.' })
  async getProduct(@Param('id', ParseIntPipe) id: number): Promise<{ data: ProductDto }> {
    const product = await this.productService.getProduct(id);
    return { data: product };
  }

  @Get()
  @ApiOperation({
    summary: '상품 리스트 조회 API',
    description: '모든 사용자는 등록된 상품들의 리스트를 페이지네이션으로 조회할 수 있다.',
  })
  async getProductList(
    @Query() getProductListPaginationDto: GetProductListPaginationDto,
  ): Promise<PaginationDto<ProductListDto>> {
    const paginationResponse = await this.productService.getProductListWithMiniumPrice(getProductListPaginationDto);
    return createPaginationResponseDto(paginationResponse);
  }
}
