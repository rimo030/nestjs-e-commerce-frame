import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CommonEntity } from './common/common.entity';
import { ProductEntity } from './product.entity';

@Entity()
export class ProductRequiredOptionEntity extends CommonEntity {
  @Column()
  productId!: number;

  @Column({ type: 'varchar', length: 32 })
  name!: string;

  @Column({ type: 'int' })
  price!: number;

  @Column({ type: 'int' })
  stock!: number;

  @Column({ type: 'varchar', length: 1 })
  status!: string;

  /**
   * relations
   */

  @ManyToOne(() => ProductEntity, (p) => p.productrequiredoptions)
  @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
  product!: ProductEntity;
}
