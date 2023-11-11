import { Entity, Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CommonEntity } from './common/common.entity';
import { CalculationType } from 'src/types/enums/calculation-type.enum';
import { OrderEntity } from './order.entity';
import { OrderProductEntity } from './order-product.entity';
import { OrderProductRequiredOptionEntity } from './order-product-riquired-option.entity';
import { OrderProductOptionEntity } from './order-product-option.entity';

@Entity({ name: 'order_product_bundle' })
export class OrderProductBundleEntity extends CommonEntity {
  @Column()
  orderId!: number;

  @Column({ name: 'shipping_calculation', type: 'varchar', length: 128 })
  shippingCalculation!: keyof typeof CalculationType;

  @Column({ name: 'shipping_fee_min', type: 'varchar', length: 128 })
  shippingFeeMin!: string;

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
