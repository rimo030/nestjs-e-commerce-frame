import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CartOptionEntity } from './cart-option.entity';
import { CommonEntity } from './common/common.entity';
import { ProductEntity } from './product.entity';

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
  isSale!: number;

  /**
   * relations
   */

  @ManyToOne(() => ProductEntity, (p) => p.productOptions)
  @JoinColumn({ referencedColumnName: 'id' })
  product!: ProductEntity;

  @OneToMany(() => CartOptionEntity, (cpo) => cpo.productOptionId)
  cartOptions!: CartOptionEntity[];
}
