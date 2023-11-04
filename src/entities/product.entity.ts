import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CommonEntity } from './common/common.entity';
import { CategoryEntity } from './category.entity';
import { ProductBundleEntity } from './product-bundle.entity';
import { ProductRequiredOptionEntity } from './product-required-option.entity';
import { ProductOptionEntity } from './product-option.entity';
import { CartEntity } from './cart.entity';

@Entity()
export class ProductEntity extends CommonEntity {
  @Column()
  bundleId!: number;

  @Column()
  categoryID!: number;

  @Column({ type: 'varchar', length: 32 })
  title!: string;

  @Column({ type: 'int' })
  price!: number;

  @Column({ type: 'varchar', length: 128 })
  description!: string;

  @Column({ type: 'text' })
  company!: string;

  /**
   * relations
   */

  @ManyToOne(() => CategoryEntity, (c) => c.products)
  @JoinColumn({ name: 'categoryID', referencedColumnName: 'id' })
  category!: CategoryEntity;

  @ManyToOne(() => ProductBundleEntity, (pb) => pb.products)
  @JoinColumn({ name: 'bundleId', referencedColumnName: 'id' })
  bundle!: ProductBundleEntity;

  @OneToMany(() => ProductRequiredOptionEntity, (pro) => pro.productId)
  productrequiredoptions!: ProductRequiredOptionEntity[];

  @OneToMany(() => ProductOptionEntity, (po) => po.productId)
  productoptions!: ProductOptionEntity[];

  @OneToMany(() => CartEntity, (c) => c.productId)
  carts!: CartEntity[];
}
