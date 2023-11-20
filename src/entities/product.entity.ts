import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { feeType } from 'src/types/enums/fee-type.enum';
import { CartEntity } from './cart.entity';
import { CategoryEntity } from './category.entity';
import { CommonEntity } from './common/common.entity';
import { CompanyEntity } from './company.entity';
import { OrderProductEntity } from './order-product.entity';
import { ProductBundleEntity } from './product-bundle.entity';
import { ProductOptionEntity } from './product-option.entity';
import { ProductRequiredOptionEntity } from './product-required-option.entity';

@Entity({ name: 'product' })
export class ProductEntity extends CommonEntity {
  @Column()
  bundleId!: number;

  @Column()
  categoryId!: number;

  @Column()
  companyId!: number;

  @Column({ type: 'tinyint' })
  isSale!: number;

  @Column({ type: 'varchar', length: 128 })
  name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description!: string;

  @Column({ type: 'varchar', length: 128 })
  feeType!: keyof typeof feeType;

  @Column({ type: 'int' })
  shippingFee!: number;

  @Column()
  img!: string;

  /**
   * relations
   */

  @ManyToOne(() => CategoryEntity, (c) => c.products)
  @JoinColumn({ referencedColumnName: 'id' })
  category!: CategoryEntity;

  @ManyToOne(() => CompanyEntity, (c) => c.products)
  @JoinColumn({ referencedColumnName: 'id' })
  company!: CompanyEntity;

  @ManyToOne(() => ProductBundleEntity, (pb) => pb.products)
  @JoinColumn({ referencedColumnName: 'id' })
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
