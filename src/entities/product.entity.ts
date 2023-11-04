import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from './common/common.entity';
import { CategoryEntity } from './category.entity';

@Entity()
export class ProductEntity extends CommonEntity {
  @Column()
  categoryID!: number;

  @Column({ type: 'varchar', length: 32 })
  title!: string;

  @Column({ type: 'int' })
  price!: number;

  @Column({ type: 'varchar', length: 128 })
  description!: string;

  @Column({ type: 'text' })
  company!: string;

  /**
   * relations
   */

  @ManyToOne(() => CategoryEntity, (c) => c.products)
  @JoinColumn({ name: 'categoryID', referencedColumnName: 'id' })
  category!: CategoryEntity;
}
