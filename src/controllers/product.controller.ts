import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { GetProductListPaginationDto } from 'src/entities/dtos/get-product-list-pagination.dto';
import { IsRequireOptionDto } from 'src/entities/dtos/is-require-options.dto';
import { PaginationResponseDto } from 'src/entities/dtos/pagination-response.dto';
import { PaginationDto } from 'src/entities/dtos/pagination.dto';
import { ProductListDto } from 'src/entities/dtos/product-list.dto';
import { ProductService } from 'src/services/product.service';

@Controller('products')
@ApiTags('Product API')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * 'GET products/:id/options?required='
   * 상품의 옵션 조회 시 쿼리로 받은 requried true, false를 통해
   * 선택 옵션과 그렇지 않은 경우를 구분할 수 있어야 한다.
   *
   * 당연히 페이지네이션이어야 하며, 1페이지가 default로 조회되어야 한다.
   * 상품의 최초 조회 시 상품의 옵션들이 조회되기 때문에 서비스 로직은 재사용될 수 있어야 한다.
   */

  @Get('/:id/options')
  @ApiOperation({
    summary: '상품 필수/선택 옵션 조회 API',
    description: '등록된 상품의 필수/선택 옵션을 조회할 수 있다.',
  })
  async getProductOptions(
    @Param('id', ParseIntPipe) productId: number,
    @Query() isRequireOptionDto: IsRequireOptionDto,
    @Query() paginationDto: PaginationDto,
  ) {
    return await this.productService.getProductOptions(productId, isRequireOptionDto, paginationDto);
  }

  @Get('/:id')
  @ApiOperation({ summary: '상품 상세 조회 API', description: '등록된 상품의 정보를 확인할 수 있다.' })
  async getProduct(@Param('id', ParseIntPipe) id: number) {
    const productAllOption = await this.productService.getProduct(id);
    return { data: productAllOption };
  }

  @Get()
  @ApiOperation({ summary: '상품 리스트 조회 API', description: '모든 사용자는 등록된 상품 리스트를 확인할 수 있다.' })
  async getProductList(
    @Query() getProductListPaginationDto: GetProductListPaginationDto,
  ): Promise<PaginationResponseDto<ProductListDto>> {
    return await this.productService.getProductList(getProductListPaginationDto);
  }
}
