import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { CommonEntity } from './common/common.entity';
import { ProductRequiredOption } from './product-required-option.entity';
import { CartProductInputOptionEntity } from './cart-product-input-option.entity';

@Entity()
export class ProductInputOption extends CommonEntity {
  @Column()
  productRequiredOptionId!: number;

  @Column({ type: 'varchar', length: 128 })
  name!: string;

  @Column({ type: 'varchar', length: 128 })
  value!: string;

  @Column({ type: 'varchar', length: 255 })
  description!: string;

  @Column({ type: 'tinyint' })
  required!: string;

  /**
   * relations
   */

  @ManyToOne(() => ProductRequiredOption, (pro) => pro.productinputoptions)
  @JoinColumn({ name: 'productRequiredOptionId', referencedColumnName: 'id' })
  productRequiredOption!: ProductRequiredOption;

  @OneToMany(
    () => CartProductInputOptionEntity,
    (cpio) => cpio.productinputoptionId,
  )
  cartproductinputoptions!: CartProductInputOptionEntity[];
}
