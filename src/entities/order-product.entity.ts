import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CartEntity } from './cart.entity';
import { CommonEntity } from './common/common.entity';
import { OrderProductBundleEntity } from './order-product-bundle.entity';
import { OrderProductOptionEntity } from './order-product-option.entity';
import { OrderProductRequiredOptionEntity } from './order-product-required-option.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'order_product' })
export class OrderProductEntity extends CommonEntity {
  @Column()
  orderProductBundleId!: number;

  @Column()
  cartId!: number;

  @Column()
  productId!: number;

  @ManyToOne(() => OrderProductBundleEntity, (o) => o.orderProducts)
  @JoinColumn({ referencedColumnName: 'id' })
  orderProductBundle!: OrderProductBundleEntity;

  @ManyToOne(() => CartEntity, (c) => c.orderProducts)
  @JoinColumn({ referencedColumnName: 'id' })
  cart!: CartEntity;

  @ManyToOne(() => ProductEntity, (p) => p.orderProducts)
  @JoinColumn({ referencedColumnName: 'id' })
  product!: ProductEntity;

  @OneToMany(() => OrderProductRequiredOptionEntity, (opro) => opro.orderProduct)
  orderProductRequiredOptions!: OrderProductRequiredOptionEntity[];

  @OneToMany(() => OrderProductOptionEntity, (opo) => opo.orderProduct)
  orderProductOptions!: OrderProductOptionEntity[];
}
