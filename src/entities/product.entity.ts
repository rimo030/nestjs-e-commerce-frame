import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CommonEntity } from './common/common.entity';
import { Category } from './category.entity';
import { ProductBundle } from './product-bundle.entity';
import { ProductRequiredOption } from './product-required-option.entity';
import { ProductOption } from './product-option.entity';
import { CartEntity } from './cart.entity';
import { Company } from './company.entity';

@Entity()
export class Product extends CommonEntity {
  @Column()
  bundleId!: number;

  @Column()
  categoryId!: number;

  @Column()
  companyId!: number;

  @Column({ type: 'varchar', length: 128 })
  title!: string;

  @Column({ type: 'int' })
  price!: number;

  @Column({ type: 'varchar', length: 255 })
  description!: string;

  @Column({ type: 'int' })
  shipping_fee!: number;

  // 이미지 컬럼
  // @Column()
  // img!: string;

  /**
   * relations
   */

  @ManyToOne(() => Category, (c) => c.products)
  @JoinColumn({ name: 'categoryId', referencedColumnName: 'id' })
  category!: Category;

  @ManyToOne(() => Company, (c) => c.products)
  @JoinColumn({ name: 'companyId', referencedColumnName: 'id' })
  company!: Company;

  @ManyToOne(() => ProductBundle, (pb) => pb.products)
  @JoinColumn({ name: 'bundleId', referencedColumnName: 'id' })
  bundle!: ProductBundle;

  @OneToMany(() => ProductRequiredOption, (pro) => pro.productId)
  productRequiredOptions!: ProductRequiredOption[];

  @OneToMany(() => ProductOption, (po) => po.productId)
  productOptions!: ProductOption[];

  @OneToMany(() => CartEntity, (c) => c.productId)
  carts!: CartEntity[];
}
