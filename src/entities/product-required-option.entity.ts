import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { CommonEntity } from './common/common.entity';
import { Product } from './product.entity';
import { ProductInputOption } from './product-input-option.entity';
import { CartProductRequiredOptionEntity } from './cart-product-required-option.entity';

@Entity()
export class ProductRequiredOption extends CommonEntity {
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

  @ManyToOne(() => Product, (p) => p.productRequiredOptions)
  @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
  product!: Product;

  @OneToMany(() => ProductInputOption, (pio) => pio.productRequiredOptionId)
  productinputoptions!: ProductInputOption[];

  @OneToMany(
    () => CartProductRequiredOptionEntity,
    (cpro) => cpro.productrequiredoptionId,
  )
  cartproductrequiredoptions!: CartProductRequiredOptionEntity[];
}
