import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from './common/common.entity';
import { ProductInputOptionEntity } from './product-input-option.entity';
import { CartRequiredOptionEntity } from './cart-required-option.entity';

@Entity({ name: 'cart_product_input_option' })
export class CartInputOptionEntity extends CommonEntity {
  @Column()
  cartRequiredId!: number;

  @Column()
  productInputOptionId!: number;

  @Column({ type: 'varchar', length: '128' })
  name!: string;

  @Column({ type: 'varchar', length: '128' })
  value!: string;

  @Column({ type: 'int' })
  count!: number;

  /**
   * relations
   */

  @ManyToOne(() => CartRequiredOptionEntity, (cpro) => cpro.cartInputOptions)
  @JoinColumn({ referencedColumnName: 'id' })
  cartRequiredOption!: CartRequiredOptionEntity;

  @ManyToOne(() => ProductInputOptionEntity, (pio) => pio.cartInputOptions)
  @JoinColumn({ referencedColumnName: 'id' })
  productInputOption!: ProductInputOptionEntity;
}
