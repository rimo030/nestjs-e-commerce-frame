import { Column, Entity, OneToMany } from 'typeorm';
import { CommonEntity } from './common/common.entity';
import { ProductBundleEntity } from './product-bundle.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'seller' })
export class SellerEntity extends CommonEntity {
  constructor(dto: Partial<SellerEntity>) {
    super();

    Object.assign(this, dto);
  }

  @Column({ type: 'varchar', length: 128, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 512 })
  hashedPassword!: string;

  @Column({ type: 'varchar', length: 32 })
  name!: string;

  @Column({ type: 'varchar', length: 11 })
  phone!: string;

  @Column({ type: 'varchar', length: 128 })
  businessNumber!: string;

  /**
   * relations
   */
  @OneToMany(() => ProductBundleEntity, (pb) => pb.seller)
  productBundles!: ProductBundleEntity[];

  @OneToMany(() => ProductEntity, (p) => p.seller)
  products!: ProductEntity[];
}
