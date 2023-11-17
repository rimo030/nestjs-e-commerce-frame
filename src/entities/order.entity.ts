import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { CommonEntity } from './common/common.entity';
import { BuyerEntity } from './buyer.entity';
import { OrderProductBundleEntity } from './order-product-bundle.entity';

@Entity({ name: 'order' })
export class OrderEntity extends CommonEntity {
  @Column()
  buyerId!: number;

  /**
   * relations
   */

  @ManyToOne(() => BuyerEntity, (b) => b.orders)
  @JoinColumn({ referencedColumnName: 'id' })
  buyer!: BuyerEntity;

  @OneToMany(() => OrderProductBundleEntity, (opb) => opb.orderId)
  orderProductBundles!: OrderProductBundleEntity[];
}
