import { Entity, Column } from 'typeorm';
import { CommonEntity } from './common/common.entity';

@Entity()
export class CartEntity extends CommonEntity {}
