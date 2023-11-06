import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { CommonEntity } from './common/common.entity';
import { ProductEntity } from './product.entity';
import { ProductInputOptionEntity } from './product-input-option.entity';
import { CartProductRequiredOptionEntity } from './cart-product-required-option.entity';

@Entity({ name: 'prodect_required_option' })
export class ProductRequiredOptionEntity extends CommonEntity {
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

  @ManyToOne(() => ProductEntity, (p) => p.productRequiredOptions)
  @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
  product!: ProductEntity;

  @OneToMany(
    () => ProductInputOptionEntity,
    (pio) => pio.productRequiredOptionId,
  )
  productinputoptions!: ProductInputOptionEntity[];

  @OneToMany(
    () => CartProductRequiredOptionEntity,
    (cpro) => cpro.productrequiredoptionId,
  )
  cartproductrequiredoptions!: CartProductRequiredOptionEntity[];
}
