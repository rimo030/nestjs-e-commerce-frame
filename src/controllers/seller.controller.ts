import { Body, Controller, Post } from '@nestjs/common';
import { CreateSellerDto } from 'src/entities/dtos/create-seller.dto';
import { SellerEntity } from 'src/entities/seller.entity';
import { SellerService } from 'src/services/seller.service';

@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Post('/')
  async createSeller(@Body() createSellerDto: CreateSellerDto): Promise<SellerEntity> {
    return await this.sellerService.createSeller(createSellerDto);
  }
}
