import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CartInputOptionEntity } from './cart-input-option.entity';
import { CommonEntity } from './common/common.entity';
import { ProductRequiredOptionEntity } from './product-required-option.entity';

@Entity({ name: 'product_input_option' })
export class ProductInputOptionEntity extends CommonEntity {
  constructor(dto: Partial<ProductInputOptionEntity>) {
    super();

    Object.assign(this, dto);
  }
  @Column()
  productRequiredOptionId!: number;

  @Column({ type: 'varchar', length: 128 })
  name!: string;

  @Column({ type: 'varchar', length: 128 })
  value!: string;

  @Column({ type: 'varchar', length: 255 })
  description!: string;

  @Column({ type: 'boolean' })
  isRequired!: boolean;

  /**
   * relations
   */

  @ManyToOne(() => ProductRequiredOptionEntity, (pro) => pro.productInputOptions)
  @JoinColumn({ referencedColumnName: 'id' })
  productRequiredOption!: ProductRequiredOptionEntity;

  @OneToMany(() => CartInputOptionEntity, (cpio) => cpio.productInputOption)
  cartInputOptions!: CartInputOptionEntity[];
}
