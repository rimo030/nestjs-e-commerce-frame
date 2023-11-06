import { Entity, Column, OneToMany } from 'typeorm';
import { CommonEntity } from './common/common.entity';
import { CartEntity } from './cart.entity';

@Entity({ name: 'user' })
export class UserEntity extends CommonEntity {
  @Column({ type: 'varchar', length: 512 })
  hashedPassword!: string;

  @Column({ type: 'varchar', length: 128 })
  name!: string;

  @Column({ type: 'tinyint' })
  gender!: number;

  @Column({ type: 'int' })
  age!: number;

  @Column({ type: 'varchar', length: 128 })
  email!: string;

  @Column({ type: 'varchar', length: 11 })
  phone!: string;

  /**
   * relations
   */

  @OneToMany(() => CartEntity, (c) => c.userId)
  carts!: CartEntity[];
}
