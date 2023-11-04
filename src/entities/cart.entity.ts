import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { CommonEntity } from './common/common.entity';
import { UserEntity } from './user.entity';
import { ProductEntity } from './product.entity';
import { CartProductRequiredOptionEntity } from './cart-product-required-option.entity';

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

  @OneToMany(() => CartProductRequiredOptionEntity, (cpro) => cpro.cartId)
  cartproductrequiredoptions!: CartProductRequiredOptionEntity[];
}
