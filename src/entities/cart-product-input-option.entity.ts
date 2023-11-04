import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { CommonEntity } from './common/common.entity';

@Entity()
export class CartProductInputOptionEntity extends CommonEntity {}
