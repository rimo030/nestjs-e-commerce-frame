import { Entity, Column } from 'typeorm';
import { CommonEntity } from './common/common.entity';

@Entity()
export class UserEntity extends CommonEntity {
  @Column({ type: 'varchar', length: 1 })
  gender!: string;

  @Column({ type: 'int' })
  age!: number;

  @Column({ type: 'varchar', length: 16 })
  email!: string;

  @Column({ type: 'varchar', length: 16 })
  phone!: string;
}
