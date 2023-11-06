import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from './common/common.entity';
import { ProductInputOptionEntity } from './product-input-option.entity';
import { CartProductRequiredOptionEntity } from './cart-product-required-option.entity';

@Entity()
export class CartProductInputOptionEntity extends CommonEntity {
  @Column()
  cartproductrequiredId!: number;

  @Column()
  productinputoptionId!: number;

  /**
   * relations
   */

  @ManyToOne(
    () => CartProductRequiredOptionEntity,
    (cpro) => cpro.cartproductinputoptions,
  )
  @JoinColumn({ name: 'cartproductrequiredId', referencedColumnName: 'id' })
  cartproductrequiredoption!: CartProductRequiredOptionEntity;

  @ManyToOne(
    () => ProductInputOptionEntity,
    (pio) => pio.cartproductinputoptions,
  )
  @JoinColumn({ name: 'productinputoptionId', referencedColumnName: 'id' })
  productinputoption!: ProductInputOptionEntity;
}
