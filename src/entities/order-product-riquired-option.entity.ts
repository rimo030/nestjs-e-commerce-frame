import { Entity, Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CommonEntity } from './common/common.entity';
import { OrderProductBundleEntity } from './order-product-bundle.entity';
import { OrderProductInputOptionEntity } from './order-product-input-option.entity';

@Entity({ name: 'order_product_required_option' })
export class OrderProductRequiredOptionEntity extends CommonEntity {
  @Column()
  OrderProductBundleId!: number;

  @Column({ type: 'varchar', length: 128 })
  name!: string;

  @Column({ type: 'int' })
  price!: number;

  @Column({ type: 'int' })
  count!: number;

  @ManyToOne(
    () => OrderProductBundleEntity,
    (opb) => opb.orderProductRequiredOptions,
  )
  @JoinColumn({ name: 'OrderProductBundleId', referencedColumnName: 'id' })
  orderProductBundle!: OrderProductBundleEntity;

  @OneToMany(
    () => OrderProductInputOptionEntity,
    (opio) => opio.orderProductRequiredOptionId,
  )
  orderProductInputOptions!: OrderProductInputOptionEntity[];
}
