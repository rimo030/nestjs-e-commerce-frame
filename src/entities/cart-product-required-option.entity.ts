import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CommonEntity } from './common/common.entity';
import { CartEntity } from './cart.entity';
import { ProductRequiredOptionEntity } from './product-required-option.entity';

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
    () => ProductRequiredOptionEntity,
    (pro) => pro.cartproductrequiredoptions,
  )
  @JoinColumn({ name: 'productrequiredoptionId', referencedColumnName: 'id' })
  productrequiredoption!: ProductRequiredOptionEntity;
}
