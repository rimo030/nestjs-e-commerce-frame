import { Module } from '@nestjs/common';
import { CustomTypeOrmModule } from 'src/configs/custom-typeorm.module';
import { CategoryRepository } from 'src/repositories/category.repository';
import { CategoryController } from '../controllers/category.controller';
import { CategoryService } from '../services/category.service';

@Module({
  imports: [CustomTypeOrmModule.forCustomRepository([CategoryRepository])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
