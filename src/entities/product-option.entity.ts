import { Entity, Column } from 'typeorm';
import { CommonEntity } from './common/common.entity';

@Entity()
export class ProductOptionEntity extends CommonEntity {
  @Column({ type: 'varchar', length: 32 })
  name!: string;

  @Column({ type: 'int' })
  price!: number;

  @Column({ type: 'int' })
  stock!: number;

  @Column({ type: 'varchar', length: 1 })
  status!: string;
}
