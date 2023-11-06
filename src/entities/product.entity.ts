import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CommonEntity } from './common/common.entity';
import { CategoryEntity } from './category.entity';
import { ProductBundleEntity } from './product-bundle.entity';
import { ProductRequiredOptionEntity } from './product-required-option.entity';
import { ProductOptionEntity } from './product-option.entity';
import { CartEntity } from './cart.entity';
import { CompanyEntity } from './company.entity';
import { OrderProductEntity } from './order-product.entity';

@Entity({ name: 'product' })
export class ProductEntity extends CommonEntity {
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
  shippingFee!: number;

  // 이미지 컬럼
  // @Column()
  // img!: string;

  /**
   * relations
   */

  @ManyToOne(() => CategoryEntity, (c) => c.products)
  @JoinColumn({ name: 'categoryId', referencedColumnName: 'id' })
  category!: CategoryEntity;

  @ManyToOne(() => CompanyEntity, (c) => c.products)
  @JoinColumn({ name: 'companyId', referencedColumnName: 'id' })
  company!: CompanyEntity;

  @ManyToOne(() => ProductBundleEntity, (pb) => pb.products)
  @JoinColumn({ name: 'bundleId', referencedColumnName: 'id' })
  bundle!: ProductBundleEntity;

  @OneToMany(() => ProductRequiredOptionEntity, (pro) => pro.productId)
  productRequiredOptions!: ProductRequiredOptionEntity[];

  @OneToMany(() => ProductOptionEntity, (po) => po.productId)
  productOptions!: ProductOptionEntity[];

  @OneToMany(() => CartEntity, (c) => c.productId)
  carts!: CartEntity[];

  @OneToMany(() => OrderProductEntity, (op) => op.productId)
  orderProducts!: OrderProductEntity[];
}
