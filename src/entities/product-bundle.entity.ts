import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { CommonEntity } from './common/common.entity';

@Entity()
export class ProductBundleEntity extends CommonEntity {
  @Column({ type: 'int' })
  deliveryFee!: number;
}
