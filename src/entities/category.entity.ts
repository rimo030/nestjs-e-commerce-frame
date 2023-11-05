import { Entity, Column, OneToMany } from 'typeorm';
import { CommonEntity } from './common/common.entity';
import { Product } from './product.entity';

@Entity()
export class Category extends CommonEntity {
  @Column({ type: 'varchar', length: 128 })
  name!: string;

  /**
   * relations
   */

  @OneToMany(() => Product, (p) => p.categoryId)
  products!: Product[];
}
