import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CommonEntity } from './common/common.entity';
import { UserEntity } from './user.entity';
import { ProductEntity } from './product.entity';

@Entity()
export class CartEntity extends CommonEntity {
  @Column()
  userId!: number;

  @Column()
  productId!: number;

  /**
   * relations
   */

  @ManyToOne(() => UserEntity, (u) => u.carts)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user!: UserEntity;

  @ManyToOne(() => ProductEntity, (p) => p.carts)
  @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
  product!: ProductEntity;
}
