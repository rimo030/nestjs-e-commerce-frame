import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateSellerDto } from 'src/entities/dtos/create-seller.dto';
import { SellerEntity } from 'src/entities/seller.entity';
import { SellerService } from 'src/services/seller.service';

@Controller('seller')
@ApiTags('Seller API')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Post('/')
  @ApiOperation({ summary: 'Seller 생성 API', description: 'Seller를 생성한다.' })
  async createSeller(@Body() createSellerDto: CreateSellerDto): Promise<SellerEntity> {
    return await this.sellerService.createSeller(createSellerDto);
  }
}
