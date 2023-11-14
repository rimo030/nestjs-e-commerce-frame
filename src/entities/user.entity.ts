import { Entity, Column, OneToMany, Unique } from 'typeorm';
import { CommonEntity } from './common/common.entity';
import { CartEntity } from './cart.entity';
import { OrderEntity } from './order.entity';
import { Board } from './board.entity';

@Entity({ name: 'user' })
// @Unique(['email'])
export class UserEntity extends CommonEntity {
  @Column({ type: 'varchar', length: 128, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 512 })
  hashedPassword!: string;

  @Column({ type: 'varchar', length: 128, nullable: true })
  name!: string;

  @Column({ type: 'tinyint', nullable: true })
  gender!: number;

  @Column({ type: 'int', nullable: true })
  age!: number;

  @Column({ type: 'varchar', length: 11, nullable: true })
  phone!: string;

  /**
   * relations
   */

  @OneToMany(() => Board, (b) => b.userId)
  boards!: Board[];

  @OneToMany(() => CartEntity, (c) => c.userId)
  carts!: CartEntity[];

  @OneToMany(() => OrderEntity, (o) => o.userId)
  orders!: OrderEntity[];
}
