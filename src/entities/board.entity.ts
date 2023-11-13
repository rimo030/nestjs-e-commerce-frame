import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BoardStatus } from '../types/enums/board-status.enum';
import { CommonEntity } from './common/common.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'board' })
export class Board extends CommonEntity {
  @Column()
  userId!: number;

  @Column({ type: 'varchar', length: 512 })
  title!: string;

  @Column('text')
  description!: string;

  @Column({ name: 'status', type: 'varchar', length: 128 })
  status!: keyof typeof BoardStatus;

  @ManyToOne(() => UserEntity, (u) => u.boards)
  @JoinColumn({ referencedColumnName: 'id' })
  user!: UserEntity;
}
