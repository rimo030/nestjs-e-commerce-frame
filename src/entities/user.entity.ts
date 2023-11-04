import { Entity, Column, OneToMany } from 'typeorm';
import { CommonEntity } from './common/common.entity';
import { CartEntity } from './cart.entity';

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

  /**
   * relations
   */

  @OneToMany(() => CartEntity, (c) => c.userId)
  carts!: CartEntity[];
}
