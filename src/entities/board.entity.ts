import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BoardStatus } from '../types/enums/board-status.enum';
import { CommonEntity } from './common/common.entity';

@Entity()
export class Board extends CommonEntity {
  @Column()
  title!: string;

  @Column()
  descrition!: string;

  @Column()
  status!: BoardStatus;
}
