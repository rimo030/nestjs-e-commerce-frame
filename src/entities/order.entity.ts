import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { CommonEntity } from './common/common.entity';
import { BuyerEntity } from './user.entity';
import { OrderProductBundleEntity } from './order-product-bundle.entity';

@Entity({ name: 'order' })
export class OrderEntity extends CommonEntity {
  @Column()
  userId!: number;

  /**
   * relations
   */

  @ManyToOne(() => BuyerEntity, (u) => u.orders)
  @JoinColumn({ referencedColumnName: 'id' })
  user!: BuyerEntity;

  @OneToMany(() => OrderProductBundleEntity, (opb) => opb.orderId)
  orderProductBundles!: OrderProductBundleEntity[];
}
