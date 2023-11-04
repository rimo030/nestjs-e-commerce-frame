import { Entity, Column } from 'typeorm';
import { CommonEntity } from './common/common.entity';
import { CalculationType } from 'src/types/enums/calculation-type.enum';

@Entity()
export class OrderProductBundleEntity extends CommonEntity {
  @Column({ name: 'shipping_fee', type: 'int' })
  shippingFee!: number;

  @Column({ name: 'shipping_calculation', type: 'varchar' })
  shippingCalculation!: keyof typeof CalculationType;
}