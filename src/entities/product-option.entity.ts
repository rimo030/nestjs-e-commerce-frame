import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { CommonEntity } from './common/common.entity';
import { Product } from './product.entity';
import { CartProductOptionEntity } from './cart-product-option.entity';

@Entity()
export class ProductOption extends CommonEntity {
  @Column()
  productId!: number;

  @Column({ type: 'varchar', length: 128 })
  name!: string;

  @Column({ type: 'int' })
  price!: number;

  @Column({ type: 'int' })
  stock!: number;

  @Column({ type: 'tinyint' })
  status!: number;

  /**
   * relations
   */

  @ManyToOne(() => Product, (p) => p.productOptions)
  @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
  product!: Product;

  @OneToMany(() => CartProductOptionEntity, (cpo) => cpo.productoptionId)
  cartproductoptions!: CartProductOptionEntity[];
}
