import { Column, Entity, OneToMany } from 'typeorm';
import { CommonEntity } from './common/common.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'category' })
export class CategoryEntity extends CommonEntity {
  constructor(dto: Partial<CategoryEntity>) {
    super();

    Object.assign(this, dto);
  }

  @Column({ type: 'varchar', length: 128, unique: true })
  name!: string;

  /**
   * relations
   */

  @OneToMany(() => ProductEntity, (p) => p.categoryId)
  products!: ProductEntity[];
}
