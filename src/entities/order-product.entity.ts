import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CartEntity } from './cart.entity';
import { CommonEntity } from './common/common.entity';
import { OrderProductBundleEntity } from './order-product-bundle.entity';
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
  @JoinColumn({ referencedColumnName: 'id' })
  orderProductBundle!: OrderProductBundleEntity;

  @ManyToOne(() => CartEntity, (c) => c.orderProducts)
  @JoinColumn({ referencedColumnName: 'id' })
  cart!: CartEntity;

  @ManyToOne(() => ProductEntity, (p) => p.orderProducts)
  @JoinColumn({ referencedColumnName: 'id' })
  product!: ProductEntity;
}
