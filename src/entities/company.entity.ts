import { Column, Entity, OneToMany } from 'typeorm';
import { CommonEntity } from './common/common.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'company' })
export class CompanyEntity extends CommonEntity {
  constructor(dto: Partial<CompanyEntity>) {
    super();

    Object.assign(this, dto);
  }

  @Column({ type: 'varchar', length: 128 })
  name!: string;

  /**
   * relations
   */

  @OneToMany(() => ProductEntity, (p) => p.companyId)
  products!: ProductEntity[];
}
