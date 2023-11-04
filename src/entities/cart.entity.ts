import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CommonEntity } from './common/common.entity';
import { UserEntity } from './user.entity';

@Entity()
export class CartEntity extends CommonEntity {
  @Column()
  userId!: number;

  /**
   * relations
   */

  @ManyToOne(() => UserEntity, (u) => u.carts)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user!: UserEntity;
}
