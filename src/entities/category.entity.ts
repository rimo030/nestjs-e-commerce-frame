import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { CommonEntity } from './common/common.entity';

@Entity()
export class CategoryEntity extends CommonEntity {
  @Column({ type: 'varchar', length: 32 })
  name!: string;
}
