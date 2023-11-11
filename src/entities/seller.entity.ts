import { Column, Entity, OneToMany } from 'typeorm';
import { CommonEntity } from './common/common.entity';
import { ProductBundleEntity } from './product-bundle.entity';

@Entity({ name: 'seller' })
export class SellerEntity extends CommonEntity {
  @Column({ type: 'varchar', length: 512 })
  hashedPassword!: string;

  @Column({ type: 'varchar', length: 32 })
  name!: string;

  @Column({ type: 'varchar', length: 128, unique: true })
  email!: string;

  /* - 기호는 포함하지 않습니다 */
  @Column({ type: 'varchar', length: 11 })
  phone!: string;

  @Column({ type: 'varchar', length: 128 })
  businessNumber!: string;

  /**
   * relations
   */
  @OneToMany(() => ProductBundleEntity, (pb) => pb.sellerId)
  productBundles!: ProductBundleEntity[];
}
