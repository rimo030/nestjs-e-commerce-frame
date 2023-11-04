import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CommonEntity } from './common/common.entity';
import { CalculationType } from 'src/types/enums/calculation-type.enum';
import { SellerEntity } from './seller.entity';

@Entity()
export class ProductBundleEntity extends CommonEntity {
  @Column()
  sellerId!: number;

  @Column({ name: 'shipping_fee', type: 'int' })
  shippingFee!: number;

  @Column({ name: 'shipping_calculation', type: 'varchar' })
  shippingCalculation!: keyof typeof CalculationType;

  /**
   * relations
   */
  @ManyToOne(() => SellerEntity, (s) => s.productBundles)
  @JoinColumn({ name: 'sellerId', referencedColumnName: 'id' })
  seller!: SellerEntity;
}
