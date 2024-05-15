import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BuyerEntity } from './buyer.entity';
import { CommonEntity } from './common/common.entity';
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

  @OneToMany(() => OrderProductBundleEntity, (opb) => opb.id)
  orderProductBundles!: OrderProductBundleEntity[];
}
