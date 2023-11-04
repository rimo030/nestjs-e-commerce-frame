import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from './common/common.entity';
import { CartEntity } from './cart.entity';
import { ProductOptionEntity } from './product-option.entity';

@Entity()
export class CartProductOptionEntity extends CommonEntity {
  @Column()
  cartId!: number;

  @Column()
  productoptionId!: number;

  /**
   * relations
   */

  @ManyToOne(() => CartEntity, (c) => c.cartproductoptions)
  @JoinColumn({ name: 'cartId', referencedColumnName: 'id' })
  cart!: CartEntity;

  @ManyToOne(() => ProductOptionEntity, (po) => po.cartproductoptions)
  @JoinColumn({ name: 'productoptionId', referencedColumnName: 'id' })
  productoption!: ProductOptionEntity;
}
