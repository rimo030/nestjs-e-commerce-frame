import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from './common/common.entity';
import { CartEntity } from './cart.entity';
import { ProductOptionEntity } from './product-option.entity';

@Entity({ name: 'cart_option' })
export class CartOptionEntity extends CommonEntity {
  @Column()
  cartId!: number;

  @Column()
  productOptionId!: number;

  @Column({ type: 'int' })
  count!: number;

  /**
   * relations
   */

  @ManyToOne(() => CartEntity, (c) => c.cartOptions)
  @JoinColumn({ referencedColumnName: 'id' })
  cart!: CartEntity;

  @ManyToOne(() => ProductOptionEntity, (po) => po.cartOptions)
  @JoinColumn({ referencedColumnName: 'id' })
  productOption!: ProductOptionEntity;
}
