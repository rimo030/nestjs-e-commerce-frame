import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BoardStatus } from '../types/enums/board-status.enum';
import { BuyerEntity } from './buyer.entity';
import { CommonEntity } from './common/common.entity';

@Entity({ name: 'board' })
export class BoardEntity extends CommonEntity {
  @Column()
  buyerId!: number;

  @Column({ type: 'varchar', length: 512 })
  title!: string;

  @Column('text')
  description!: string;

  @Column({ name: 'status', type: 'varchar', length: 128 })
  status!: keyof typeof BoardStatus;

  /**
   * relations
   */

  @ManyToOne(() => BuyerEntity, (b) => b.boards)
  @JoinColumn({ referencedColumnName: 'id' })
  buyer!: BuyerEntity;
}
