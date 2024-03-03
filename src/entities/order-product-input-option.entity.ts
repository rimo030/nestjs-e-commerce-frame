import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from './common/common.entity';
import { OrderProductRequiredOptionEntity } from './order-product-required-option.entity';

@Entity({ name: 'order_product_input_option' })
export class OrderProductInputOptionEntity extends CommonEntity {
  @Column()
  orderProductRequiredOptionId!: number;

  @Column({ type: 'varchar', length: '32' })
  name!: string;

  @Column({ type: 'int' })
  value!: number;

  @Column({ type: 'int' })
  count!: number;

  @ManyToOne(() => OrderProductRequiredOptionEntity, (opro) => opro.orderProductInputOptions)
  @JoinColumn({ referencedColumnName: 'id' })
  orderProductRequiredOption!: OrderProductRequiredOptionEntity;
}
