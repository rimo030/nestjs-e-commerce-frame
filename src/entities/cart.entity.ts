import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { CommonEntity } from './common/common.entity';
import { UserEntity } from './user.entity';
import { ProductEntity } from './product.entity';
import { CartRequiredOptionEntity } from './cart-product-required-option.entity';
import { CartOptionEntity } from './cart-product-option.entity';

@Entity({ name: 'cart' })
export class CartEntity extends CommonEntity {
  @Column()
  userId!: number;

  @Column()
  productId!: number;

  @Column({ type: 'int' })
  count!: number;

  /**
   * relations
   */

  @ManyToOne(() => UserEntity, (u) => u.carts)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user!: UserEntity;

  @ManyToOne(() => ProductEntity, (p) => p.carts)
  @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
  product!: ProductEntity;

  @OneToMany(() => CartRequiredOptionEntity, (cpro) => cpro.cartId)
  cartRequiredOptions!: CartRequiredOptionEntity[];

  @OneToMany(() => CartOptionEntity, (cpo) => cpo.cartId)
  cartOptions!: CartOptionEntity[];
}
