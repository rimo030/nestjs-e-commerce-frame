import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BuyerEntity } from './buyer.entity';
import { CartOptionEntity } from './cart-option.entity';
import { CartRequiredOptionEntity } from './cart-required-option.entity';
import { CommonEntity } from './common/common.entity';
import { OrderProductEntity } from './order-product.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'cart' })
export class CartEntity extends CommonEntity {
  @Column()
  buyerId!: number;

  @Column()
  productId!: number;

  @Column({ type: 'int' })
  count!: number;

  /**
   * relations
   */

  @ManyToOne(() => BuyerEntity, (b) => b.carts)
  @JoinColumn({ referencedColumnName: 'id' })
  buyer!: BuyerEntity;

  @ManyToOne(() => ProductEntity, (p) => p.carts)
  @JoinColumn({ referencedColumnName: 'id' })
  product!: ProductEntity;

  @OneToMany(() => CartRequiredOptionEntity, (cpro) => cpro.cartId)
  cartRequiredOptions!: CartRequiredOptionEntity[];

  @OneToMany(() => CartOptionEntity, (cpo) => cpo.cartId)
  cartOptions!: CartOptionEntity[];

  @OneToMany(() => OrderProductEntity, (op) => op.cartId)
  orderProducts!: OrderProductEntity[];
}
