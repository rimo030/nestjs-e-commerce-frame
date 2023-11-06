import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { CommonEntity } from './common/common.entity';
import { CalculationType } from 'src/types/enums/calculation-type.enum';
import { Seller } from './seller.entity';
import { Product } from './product.entity';

@Entity()
export class ProductBundle extends CommonEntity {
  @Column()
  sellerId!: number;

  @Column({ name: 'shipping_calculation', type: 'varchar', length: 128 })
  shippingCalculation!: keyof typeof CalculationType;

  @Column({ name: 'shipping_fee_min', type: 'varchar', length: 128 })
  shippingFeeMin!: string;

  /**
   * relations
   */
  @ManyToOne(() => Seller, (s) => s.productBundles)
  @JoinColumn({ name: 'sellerId', referencedColumnName: 'id' })
  seller!: Seller;

  @OneToMany(() => Product, (p) => p.bundleId)
  products!: Product[];
}
