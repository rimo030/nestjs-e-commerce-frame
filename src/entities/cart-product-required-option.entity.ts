import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { CommonEntity } from './common/common.entity';
import { CartEntity } from './cart.entity';
import { ProductRequiredOptionEntity } from './product-required-option.entity';
import { CartInputOptionEntity as CartInputOptionEntity } from './cart-product-input-option.entity';

@Entity({ name: 'cart_required_option' })
export class CartRequiredOptionEntity extends CommonEntity {
  @Column()
  cartId!: number;

  @Column()
  productRequiredOptionId!: number;

  @Column({ type: 'int' })
  count!: number;

  /**
   * relations
   */

  @ManyToOne(() => CartEntity, (c) => c.cartRequiredOptions)
  @JoinColumn({ name: 'cartId', referencedColumnName: 'id' })
  cart!: CartEntity;

  @ManyToOne(
    () => ProductRequiredOptionEntity,
    (pro) => pro.cartRequiredOptions,
  )
  @JoinColumn({ name: 'productRequiredOptionId', referencedColumnName: 'id' })
  productRequiredOption!: ProductRequiredOptionEntity;

  @OneToMany(() => CartInputOptionEntity, (cpio) => cpio.cartRequiredId)
  cartInputOptions!: CartInputOptionEntity[];
}
