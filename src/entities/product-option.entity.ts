import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { CommonEntity } from './common/common.entity';
import { ProductEntity } from './product.entity';
import { CartOptionEntity } from './cart-option.entity';

@Entity({ name: 'product_option' })
export class ProductOptionEntity extends CommonEntity {
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

  @ManyToOne(() => ProductEntity, (p) => p.productOptions)
  @JoinColumn({ referencedColumnName: 'id' })
  product!: ProductEntity;

  @OneToMany(() => CartOptionEntity, (cpo) => cpo.productOptionId)
  cartOptions!: CartOptionEntity[];
}
