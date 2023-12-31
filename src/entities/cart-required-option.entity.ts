import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CartInputOptionEntity } from './cart-input-option.entity';
import { CartEntity } from './cart.entity';
import { CommonEntity } from './common/common.entity';
import { ProductRequiredOptionEntity } from './product-required-option.entity';

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
  @JoinColumn({ referencedColumnName: 'id' })
  cart!: CartEntity;

  @ManyToOne(() => ProductRequiredOptionEntity, (pro) => pro.cartRequiredOptions)
  @JoinColumn({ referencedColumnName: 'id' })
  productRequiredOption!: ProductRequiredOptionEntity;

  @OneToMany(() => CartInputOptionEntity, (cpio) => cpio.cartRequiredOption)
  cartInputOptions!: CartInputOptionEntity[];
}
