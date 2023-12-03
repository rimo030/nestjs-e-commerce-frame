import { BoardEntity } from 'src/entities/board.entity';
import { CartEntity } from 'src/entities/cart.entity';
import { OrderEntity } from 'src/entities/order.entity';

export interface BuyerAuthResult {
  email: string;
  name: string;
  gender: number;
  age: number;
  phone: string;
  boards: BoardEntity[];
  carts: CartEntity[];
  orders: OrderEntity[];
  id: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
