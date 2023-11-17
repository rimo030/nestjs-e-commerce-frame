import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BoardStatus } from '../types/enums/board-status.enum';
import { CommonEntity } from './common/common.entity';
import { BuyerEntity } from './user.entity';

@Entity({ name: 'board' })
export class BoardEntity extends CommonEntity {
  @Column()
  userId!: number;

  @Column({ type: 'varchar', length: 512 })
  title!: string;

  @Column('text')
  description!: string;

  @Column({ name: 'status', type: 'varchar', length: 128 })
  status!: keyof typeof BoardStatus;

  /**
   * relations
   */

  @ManyToOne(() => BuyerEntity, (u) => u.boards)
  @JoinColumn({ referencedColumnName: 'id' })
  user!: BuyerEntity;
}
