import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CommonEntity } from './common/common.entity';
import { ProductRequiredOptionEntity } from './product-required-option.entity';

@Entity()
export class ProductInputOptionEntity extends CommonEntity {
  @Column()
  productrequiredoptionId!: number;

  @Column({ type: 'varchar', length: 32 })
  name!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'varchar', length: 128 })
  value!: string;

  /**
   * relations
   */

  @ManyToOne(
    () => ProductRequiredOptionEntity,
    (pro) => pro.productinputoptions,
  )
  @JoinColumn({ name: 'productrequiredoptionId', referencedColumnName: 'id' })
  productrequiredoption!: ProductRequiredOptionEntity;
}
