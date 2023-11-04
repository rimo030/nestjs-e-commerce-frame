import { Entity, Column } from 'typeorm';
import { CommonEntity } from './common/common.entity';

@Entity()
export class OrderProductInputOptionEntity extends CommonEntity {
  @Column({ type: 'varchar', length: '32' })
  name!: string;

  @Column({ type: 'int' })
  value!: number;
}