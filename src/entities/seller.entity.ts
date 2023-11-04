import { Column, Entity } from 'typeorm';
import { CommonEntity } from './common/common.entity';

@Entity()
export class SellerEntity extends CommonEntity {
  @Column({ type: 'varchar', length: 32 })
  name!: string;

  @Column({ type: 'varchar', length: 128, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 512 })
  hashedPassword!: string;
}
