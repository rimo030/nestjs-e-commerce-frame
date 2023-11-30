import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetProductDto {
  @ApiProperty({ description: '현재 페이지', required: false })
  @Type(() => Number)
  @IsNumber()
  page: number = 1;

  @ApiProperty({ description: '페이지 당 상품 개수', required: false })
  @Type(() => Number)
  @IsNumber()
  limit: number = 15;

  @ApiProperty({ description: '검색 키워드', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ description: '카테고리 id', required: false })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @ApiProperty({ description: '판매자 id', required: false })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  sellerId?: number;
}
