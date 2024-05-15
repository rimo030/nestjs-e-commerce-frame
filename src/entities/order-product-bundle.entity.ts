import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { chargeStandard } from 'src/types/charge-standard.type';
import { CommonEntity } from './common/common.entity';
import { OrderProductEntity } from './order-product.entity';
import { OrderEntity } from './order.entity';

@Entity({ name: 'order_product_bundle' })
export class OrderProductBundleEntity extends CommonEntity {
  @Column()
  orderId!: number;

  @Column({ type: 'varchar', length: 128 })
  bundleName!: string;

  @Column({ type: 'varchar', length: 128 })
  feeStandard!: chargeStandard;

  /**
   * relations
   */

  @OneToMany(() => OrderProductEntity, (op) => op.orderProductBundle)
  orderProducts!: OrderProductEntity[];

  @ManyToOne(() => OrderEntity, (o) => o.orderProductBundles)
  @JoinColumn({ referencedColumnName: 'id' })
  order!: OrderEntity;
}
