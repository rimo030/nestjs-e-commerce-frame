import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { CommonEntity } from './common/common.entity';
import { UserEntity } from './user.entity';
import { OrderProductBundleEntity } from './order-product-bundle.entity';

@Entity({ name: 'order' })
export class OrderEntity extends CommonEntity {
  @Column()
  userId!: number;

  /**
   * relations
   */

  @ManyToOne(() => UserEntity, (u) => u.orders)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user!: UserEntity;

  @OneToMany(() => OrderProductBundleEntity, (opb) => opb.orderId)
  orderProductBundles!: OrderProductBundleEntity[];
}
