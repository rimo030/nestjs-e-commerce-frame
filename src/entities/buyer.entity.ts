import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { BoardEntity } from './board.entity';
import { CartEntity } from './cart.entity';
import { CommonEntity } from './common/common.entity';
import { OrderEntity } from './order.entity';

@Entity({ name: 'buyer' })
export class BuyerEntity extends CommonEntity {
  @Column({ type: 'varchar', length: 128, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 512 })
  hashedPassword!: string;

  @Column({ type: 'varchar', length: 128 })
  name!: string;

  @Column({ type: 'tinyint' })
  gender!: number;

  @Column({ type: 'int' })
  age!: number;

  @Column({ type: 'varchar', length: 11 })
  phone!: string;

  /**
   * relations
   */

  @OneToMany(() => BoardEntity, (b) => b.buyerId)
  boards!: BoardEntity[];

  @OneToMany(() => CartEntity, (c) => c.buyerId)
  carts!: CartEntity[];

  @OneToMany(() => OrderEntity, (o) => o.buyerId)
  orders!: OrderEntity[];
}