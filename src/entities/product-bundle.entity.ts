import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { feeStandard } from 'src/types/enums/fee-standard.enum';
import { CommonEntity } from './common/common.entity';
import { ProductEntity } from './product.entity';
import { SellerEntity } from './seller.entity';

@Entity({ name: 'product_bundle' })
export class ProductBundleEntity extends CommonEntity {
  @Column()
  sellerId!: number;

  @Column({ type: 'varchar', length: 128 })
  name!: string;

  @Column({ type: 'varchar', length: 128 })
  chargeStandard!: keyof typeof feeStandard;

  /**
   * relations
   */
  @ManyToOne(() => SellerEntity, (s) => s.productBundles)
  @JoinColumn({ referencedColumnName: 'id' })
  seller!: SellerEntity;

  @OneToMany(() => ProductEntity, (p) => p.bundleId)
  products!: ProductEntity[];
}
