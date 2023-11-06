import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { OrderProductBundleEntity } from './order-product-bundle.entity';
import { CommonEntity } from './common/common.entity';
import { CartEntity } from './cart.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'order_product' })
export class OrderProductEntity extends CommonEntity {
  @Column()
  orderProductId!: number;

  @Column()
  cartId!: number;

  @Column()
  productId!: number;

  @ManyToOne(() => OrderProductBundleEntity, (o) => o.orderProducts)
  @JoinColumn({ name: 'orderProductId', referencedColumnName: 'id' })
  orderProductBundle!: OrderProductBundleEntity;

  @ManyToOne(() => CartEntity, (c) => c.orderProducts)
  @JoinColumn({ name: 'cartId', referencedColumnName: 'id' })
  cart!: CartEntity;

  @ManyToOne(() => ProductEntity, (p) => p.orderProducts)
  @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
  product!: ProductEntity;
}
