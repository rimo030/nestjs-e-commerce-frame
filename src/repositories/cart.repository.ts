import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from 'src/entities/cart.entity';
import { CartProductDetailDto } from 'src/entities/dtos/cart-product-detail.dto';
import { CartDto } from 'src/entities/dtos/cart.dto';

@Injectable()
export class CartRepository {
  constructor(
    @InjectRepository(CartEntity)
    private cartRepository: Repository<CartEntity>,
  ) {}

  /**
   * 장바구니를 생성합니다.
   * @param buyerId buyer의 아이디 입니다.
   * @param productId 상품의 아이디 입니다.
   */
  async saveCart(buyerId: number, productId: number): Promise<{ id: number }> {
    return await this.cartRepository.save({ buyerId, productId });
  }

  /**
   * 해당 상품이 buyer의 장바구니에 담겨있는지 조회합니다.
   * 담긴 옵션도 모두 조회되어야 합니다.
   * 해당 상품이 중복되어 담겨있는 경우 마지막에 담긴 상품이 조회됩니다.
   *
   * @param buyerId 조회할 buyer의 아이디 입니다.
   * @param productId 조회할 상품의 아이디 입니다.
   */
  async findCartByProductId(buyerId: number, productId: number): Promise<CartDto | null> {
    const cart = await this.cartRepository.findOne({
      select: {
        id: true,
        productId: true,
        buyerId: true,
        cartRequiredOptions: { id: true, cartId: true, productRequiredOptionId: true, count: true },
        cartOptions: { id: true, cartId: true, productOptionId: true, count: true },
      },
      order: { id: 'desc' },
      where: { buyerId, productId },
      relations: ['cartRequiredOptions', 'cartOptions'],
    });
    return cart;
  }

  /**
   * 장바구니를 조회합니다.
   * 장바구니의 정보와 담긴 상품과 필수/선택옵션의 데이터도 함께 조회되어야 합니다.
   *
   * @param cartId 조회할 장바구니의 아이디 입니다.
   */
  async findCartDetail(cartId: number): Promise<CartProductDetailDto | null> {
    const carts = await this.cartRepository.findOne({
      select: {
        id: true,
        productId: true,
        buyerId: true,
        product: {
          id: true,
          sellerId: true,
          bundleId: true,
          categoryId: true,
          companyId: true,
          isSale: true,
          name: true,
          description: true,
          deliveryType: true,
          deliveryFreeOver: true,
          deliveryCharge: true,
          img: true,
        },
        cartRequiredOptions: {
          id: true,
          cartId: true,
          productRequiredOptionId: true,
          count: true,
          productRequiredOption: {
            id: true,
            productId: true,
            name: true,
            price: true,
            isSale: true,
          },
        },
        cartOptions: {
          id: true,
          cartId: true,
          productOptionId: true,
          count: true,
          productOption: {
            id: true,
            productId: true,
            name: true,
            price: true,
            isSale: true,
          },
        },
      },
      order: { id: 'asc' },
      where: { id: cartId },
      relations: [
        'product',
        'cartRequiredOptions',
        'cartRequiredOptions.productRequiredOption',
        'cartOptions',
        'cartOptions.productOption',
      ],
    });
    return carts;
  }

  /**
   * buyer의 장바구니에 담긴 모든 데이터를 조회합니다.
   * 장바구니의 정보와 담긴 상품과 필수/선택옵션의 데이터도 함께 조회되어야 합니다.
   *
   * @param buyerId 조회할 buyer의 id입니다.
   */
  async findCartDetails(buyerId: number): Promise<CartProductDetailDto[]> {
    const carts = await this.cartRepository.find({
      select: {
        id: true,
        productId: true,
        buyerId: true,
        product: {
          id: true,
          sellerId: true,
          bundleId: true,
          categoryId: true,
          companyId: true,
          isSale: true,
          name: true,
          description: true,
          deliveryType: true,
          deliveryFreeOver: true,
          deliveryCharge: true,
          img: true,
        },
        cartRequiredOptions: {
          id: true,
          cartId: true,
          productRequiredOptionId: true,
          count: true,
          productRequiredOption: {
            id: true,
            productId: true,
            name: true,
            price: true,
            isSale: true,
          },
        },
        cartOptions: {
          id: true,
          cartId: true,
          productOptionId: true,
          count: true,
          productOption: {
            id: true,
            productId: true,
            name: true,
            price: true,
            isSale: true,
          },
        },
      },
      order: { id: 'asc' },
      where: { buyerId },
      relations: [
        'product',
        'cartRequiredOptions',
        'cartRequiredOptions.productRequiredOption',
        'cartOptions',
        'cartOptions.productOption',
      ],
    });

    return carts;
  }
}
