import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { CommonEntity } from './common/common.entity';
import { CartEntity } from './cart.entity';
import { ProductRequiredOption } from './product-required-option.entity';
import { CartProductInputOptionEntity } from './cart-product-input-option.entity';

@Entity()
export class CartProductRequiredOptionEntity extends CommonEntity {
  @Column()
  cartId!: number;

  @Column()
  productrequiredoptionId!: number;

  /**
   * relations
   */

  @ManyToOne(() => CartEntity, (c) => c.cartproductrequiredoptions)
  @JoinColumn({ name: 'cartId', referencedColumnName: 'id' })
  cart!: CartEntity;

  @ManyToOne(
    () => ProductRequiredOption,
    (pro) => pro.cartproductrequiredoptions,
  )
  @JoinColumn({ name: 'productrequiredoptionId', referencedColumnName: 'id' })
  productrequiredoption!: ProductRequiredOption;

  @OneToMany(
    () => CartProductInputOptionEntity,
    (cpio) => cpio.cartproductrequiredId,
  )
  cartproductinputoptions!: CartProductInputOptionEntity[];
}
