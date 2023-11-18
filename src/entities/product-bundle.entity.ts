import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CalculationType } from 'src/types/enums/calculation-type.enum';
import { CommonEntity } from './common/common.entity';
import { ProductEntity } from './product.entity';
import { SellerEntity } from './seller.entity';

@Entity({ name: 'product_bundle' })
export class ProductBundleEntity extends CommonEntity {
  @Column()
  sellerId!: number;

  @Column({ name: 'shipping_calculation', type: 'varchar', length: 128 })
  shippingCalculation!: keyof typeof CalculationType;

  @Column({ name: 'shipping_fee_min', type: 'varchar', length: 128 })
  shippingFeeMin!: string;

  /**
   * relations
   */
  @ManyToOne(() => SellerEntity, (s) => s.productBundles)
  @JoinColumn({ referencedColumnName: 'id' })
  seller!: SellerEntity;

  @OneToMany(() => ProductEntity, (p) => p.bundleId)
  products!: ProductEntity[];
}
