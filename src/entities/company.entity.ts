import { Entity, Column, OneToMany } from 'typeorm';
import { CommonEntity } from './common/common.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'company' })
export class CompanyEntity extends CommonEntity {
  @Column({ type: 'varchar', length: 128 })
  name!: string;

  @Column({ type: 'varchar', length: 128, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 11, nullable: true })
  phone!: string;

  /**
   * relations
   */

  @OneToMany(() => ProductEntity, (p) => p.companyId)
  products!: ProductEntity[];
}
