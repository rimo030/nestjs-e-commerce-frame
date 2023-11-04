import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { CommonEntity } from './common/common.entity';
import { ProductEntity } from './product.entity';
import { ProductInputOptionEntity } from './product-input-option.entity';
import { CartProductRequiredOptionEntity } from './cart-product-required-option.entity';

@Entity()
export class ProductRequiredOptionEntity extends CommonEntity {
  @Column()
  productId!: number;

  @Column({ type: 'varchar', length: 32 })
  name!: string;

  @Column({ type: 'int' })
  price!: number;

  @Column({ type: 'int' })
  stock!: number;

  @Column({ type: 'varchar', length: 1 })
  status!: string;

  /**
   * relations
   */

  @ManyToOne(() => ProductEntity, (p) => p.productrequiredoptions)
  @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
  product!: ProductEntity;

  @OneToMany(
    () => ProductInputOptionEntity,
    (pio) => pio.productrequiredoptionId,
  )
  productinputoptions!: ProductInputOptionEntity[];

  @OneToMany(
    () => CartProductRequiredOptionEntity,
    (cpro) => cpro.productrequiredoptionId,
  )
  cartproductrequiredoptions!: CartProductRequiredOptionEntity[];
}
