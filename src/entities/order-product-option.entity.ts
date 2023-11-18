import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from './common/common.entity';
import { OrderProductBundleEntity } from './order-product-bundle.entity';

@Entity({ name: 'order_product_option' })
export class OrderProductOptionEntity extends CommonEntity {
  @Column()
  OrderProductOptionId!: number;

  @Column({ type: 'varchar', length: 128 })
  name!: string;

  @Column({ type: 'int' })
  price!: number;

  @Column({ type: 'int' })
  count!: number;

  @ManyToOne(() => OrderProductBundleEntity, (opb) => opb.orderProductOptions)
  @JoinColumn({ referencedColumnName: 'id' })
  orderProductBundle!: OrderProductBundleEntity;
}
