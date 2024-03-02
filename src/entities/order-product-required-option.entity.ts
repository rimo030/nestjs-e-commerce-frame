import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CommonEntity } from './common/common.entity';
import { OrderProductInputOptionEntity } from './order-product-input-option.entity';
import { OrderProductEntity } from './order-product.entity';

@Entity({ name: 'order_product_required_option' })
export class OrderProductRequiredOptionEntity extends CommonEntity {
  @Column()
  orderProductId!: number;

  @Column({ type: 'varchar', length: 128 })
  name!: string;

  @Column({ type: 'int' })
  price!: number;

  @Column({ type: 'int' })
  count!: number;

  @ManyToOne(() => OrderProductEntity, (opb) => opb.orderProductRequiredOptions)
  @JoinColumn({ referencedColumnName: 'id' })
  orderProduct!: OrderProductEntity;

  @OneToMany(() => OrderProductInputOptionEntity, (opio) => opio.orderProductRequiredOption)
  orderProductInputOptions!: OrderProductInputOptionEntity[];
}
