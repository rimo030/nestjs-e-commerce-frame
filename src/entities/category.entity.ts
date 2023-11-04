import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CommonEntity } from './common/common.entity';
import { ProductEntity } from './product.entity';

@Entity()
export class CategoryEntity extends CommonEntity {
  @Column({ type: 'varchar', length: 32 })
  name!: string;

  /**
   * relations
   */

  @OneToMany(() => ProductEntity, (p) => p.categoryID)
  products!: ProductEntity[];
}
