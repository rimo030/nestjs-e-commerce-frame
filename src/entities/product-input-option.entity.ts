import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { CommonEntity } from './common/common.entity';

@Entity()
export class ProductInputOptionEntity extends CommonEntity {
  @Column({ type: 'varchar', length: 32 })
  name!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'varchar', length: 128 })
  value!: string;
}
