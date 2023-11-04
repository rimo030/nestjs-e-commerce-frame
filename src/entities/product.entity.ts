import { Column, Entity } from 'typeorm';
import { CommonEntity } from './common/common.entity';

@Entity()
export class ProductEntity extends CommonEntity {
  @Column({ type: 'varchar', length: 32 })
  title!: string;

  @Column({ type: 'int' })
  price!: number;

  @Column({ type: 'varchar', length: 128 })
  description!: string;

  @Column({ type: 'text' })
  company!: string;
}
