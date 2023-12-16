import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CartOptionEntity } from './cart-option.entity';
import { CommonEntity } from './common/common.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'product_option' })
export class ProductOptionEntity extends CommonEntity {
  constructor(dto: Partial<ProductOptionEntity>) {
    super();

    Object.assign(this, dto);
  }

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

  @ManyToOne(() => ProductEntity, (p) => p.productOptions)
  @JoinColumn({ referencedColumnName: 'id' })
  product!: ProductEntity;

  @OneToMany(() => CartOptionEntity, (cpo) => cpo.productOption)
  cartOptions!: CartOptionEntity[];
}
