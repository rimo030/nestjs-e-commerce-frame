import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { chargeStandard } from 'src/types/enums/charge-standard.enum';
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
  chargeStandard!: keyof typeof chargeStandard;

  /**
   * relations
   */
  @ManyToOne(() => SellerEntity, (s) => s.productBundles)
  @JoinColumn({ referencedColumnName: 'id' })
  seller!: SellerEntity;

  @OneToMany(() => ProductEntity, (p) => p.bundle)
  products!: ProductEntity[];
}
