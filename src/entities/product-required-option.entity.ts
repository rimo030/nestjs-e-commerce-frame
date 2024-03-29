import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CartRequiredOptionEntity } from './cart-required-option.entity';
import { CommonEntity } from './common/common.entity';
import { ProductInputOptionEntity } from './product-input-option.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'product_required_option' })
export class ProductRequiredOptionEntity extends CommonEntity {
  @Column()
  productId!: number;

  @Column({ type: 'varchar', length: 128 })
  name!: string;

  @Column({ type: 'int' })
  price!: number;

  @Column({ type: 'boolean' })
  isSale!: boolean;

  /**
   * relations
   */

  @ManyToOne(() => ProductEntity, (p) => p.productRequiredOptions)
  @JoinColumn({ referencedColumnName: 'id' })
  product!: ProductEntity;

  @OneToMany(() => ProductInputOptionEntity, (pio) => pio.productRequiredOption)
  productInputOptions!: ProductInputOptionEntity[];

  @OneToMany(() => CartRequiredOptionEntity, (cpro) => cpro.productRequiredOption)
  cartRequiredOptions!: CartRequiredOptionEntity[];
}
