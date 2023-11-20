import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { feeStandard } from 'src/types/enums/fee-standard.enum';
import { CommonEntity } from './common/common.entity';
import { OrderProductOptionEntity } from './order-product-option.entity';
import { OrderProductRequiredOptionEntity } from './order-product-riquired-option.entity';
import { OrderProductEntity } from './order-product.entity';
import { OrderEntity } from './order.entity';

@Entity({ name: 'order_product_bundle' })
export class OrderProductBundleEntity extends CommonEntity {
  @Column()
  orderId!: number;

  @Column({ type: 'varchar', length: 128 })
  bundleName!: string;

  @Column({ type: 'varchar', length: 128 })
  feeStandard!: keyof typeof feeStandard;

  /**
   * relations
   */

  @OneToMany(() => OrderProductEntity, (op) => op.orderProductId)
  orderProducts!: OrderProductEntity[];

  @OneToMany(() => OrderProductRequiredOptionEntity, (opro) => opro.OrderProductBundleId)
  orderProductRequiredOptions!: OrderProductRequiredOptionEntity[];

  @OneToMany(() => OrderProductOptionEntity, (opo) => opo.OrderProductOptionId)
  orderProductOptions!: OrderProductOptionEntity[];

  @ManyToOne(() => OrderEntity, (o) => o.orderProductBundles)
  @JoinColumn({ referencedColumnName: 'id' })
  user!: OrderEntity;
}
