import { Entity, Column, OneToMany } from 'typeorm';
import { CommonEntity } from './common/common.entity';
import { Product } from './product.entity';

@Entity()
export class Company extends CommonEntity {
  @Column({ type: 'varchar', length: 128 })
  name!: string;

  /**
   * relations
   */

  @OneToMany(() => Product, (p) => p.companyId)
  products!: Product[];
}
