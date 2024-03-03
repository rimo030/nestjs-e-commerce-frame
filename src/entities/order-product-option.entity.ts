import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from './common/common.entity';
import { OrderProductEntity } from './order-product.entity';

@Entity({ name: 'order_product_option' })
export class OrderProductOptionEntity extends CommonEntity {
  @Column()
  orderProductId!: number;

  @Column({ type: 'varchar', length: 128 })
  name!: string;

  @Column({ type: 'int' })
  price!: number;

  @Column({ type: 'int' })
  count!: number;

  @ManyToOne(() => OrderProductEntity, (opb) => opb.orderProductOptions)
  @JoinColumn({ referencedColumnName: 'id' })
  orderProduct!: OrderProductEntity;
}
