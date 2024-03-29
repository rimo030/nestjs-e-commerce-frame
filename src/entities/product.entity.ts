import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { deliveryType } from 'src/types/enums/fee-type.enum';
import { CartEntity } from './cart.entity';
import { CategoryEntity } from './category.entity';
import { CommonEntity } from './common/common.entity';
import { CompanyEntity } from './company.entity';
import { OrderProductEntity } from './order-product.entity';
import { ProductBundleEntity } from './product-bundle.entity';
import { ProductOptionEntity } from './product-option.entity';
import { ProductRequiredOptionEntity } from './product-required-option.entity';
import { SellerEntity } from './seller.entity';

@Entity({ name: 'product' })
export class ProductEntity extends CommonEntity {
  @Column()
  sellerId!: number;

  @Column({ nullable: true })
  bundleId?: number | null;

  @Column()
  categoryId!: number;

  @Column()
  companyId!: number;

  @Column({ type: 'boolean' })
  isSale!: boolean;

  @Column({ type: 'varchar', length: 128 })
  name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string | null;

  @Column({ type: 'varchar', length: 128 })
  deliveryType!: keyof typeof deliveryType;

  @Column({ type: 'int', nullable: true })
  deliveryFreeOver?: number | null;

  @Column({ type: 'int' })
  deliveryCharge!: number;

  @Column()
  img!: string;

  /**
   * relations
   */

  @ManyToOne(() => SellerEntity, (s) => s.products)
  @JoinColumn({ referencedColumnName: 'id' })
  seller!: SellerEntity;

  @ManyToOne(() => CategoryEntity, (c) => c.products)
  @JoinColumn({ referencedColumnName: 'id' })
  category!: CategoryEntity;

  @ManyToOne(() => CompanyEntity, (c) => c.products)
  @JoinColumn({ referencedColumnName: 'id' })
  company!: CompanyEntity;

  @ManyToOne(() => ProductBundleEntity, (pb) => pb.products)
  @JoinColumn({ referencedColumnName: 'id' })
  bundle?: ProductBundleEntity;

  @OneToMany(() => ProductRequiredOptionEntity, (pro) => pro.product)
  productRequiredOptions!: ProductRequiredOptionEntity[];

  @OneToMany(() => ProductOptionEntity, (po) => po.product)
  productOptions!: ProductOptionEntity[];

  @OneToMany(() => CartEntity, (c) => c.product)
  carts!: CartEntity[];

  @OneToMany(() => OrderProductEntity, (op) => op.product)
  orderProducts!: OrderProductEntity[];
}
