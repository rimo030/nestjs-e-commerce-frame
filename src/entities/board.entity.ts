import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BoardStatus } from '../types/enums/board-status.enum';
import { CommonEntity } from './common/common.entity';

@Entity({ name: 'board' })
export class Board extends CommonEntity {
  @Column({ type: 'varchar', length: 512 })
  title!: string;

  @Column('text')
  descrition!: string;

  @Column({ name: 'status', type: 'varchar', length: 128 })
  status!: keyof typeof BoardStatus;
}
