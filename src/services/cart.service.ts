import { Injectable } from '@nestjs/common';
import { CartDto } from 'src/entities/dtos/cart.dto';
import { CreateCartDto } from 'src/entities/dtos/create-cart.dto';
import { ProductBundleEntity } from 'src/entities/product-bundle.entity';
import { CartOptionRepository } from 'src/repositories/cart-option.repository';
import { CartRequiredOptionRepository } from 'src/repositories/cart-required-option.repository';
import { CartRepository } from 'src/repositories/cart.repository';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly cartRequiredOptionRepository: CartRequiredOptionRepository,
    private readonly cartOptionRepository: CartOptionRepository,
  ) {}

  /**
   * 1. 장바구니를 조회한다.
   * 2. 장바구니에 아직 없는 상품인 경우 그대로 장바구니, 장바구니 옵션, 장바구니 선택 옵션을 담는다.
   * 3. 장바구니에 이미 있는 상품일 경우
   * 3-1. 이미 존재하는 옵션인지 체크하고, 존재할 경우에는 수량만 더해주고 없을 경우에는 장바구니 옵션을 추가한다.
   * 3-2. 선택 옵션도 동일하게 처리한다.
   */
  async addCart(buyerId: number, createCartDto: CreateCartDto): Promise<CartDto> {
    const cart = await this.cartRepository.findCart(buyerId, createCartDto.productId);

    if (!cart) {
      const newCart = await this.cartRepository.saveCart(buyerId, createCartDto.productId);

      const cartRequiedOptions = await this.cartRequiredOptionRepository.saveCart(
        newCart.id,
        createCartDto.cartRequiredOptions,
      );
      const cartOptions = await this.cartOptionRepository.saveCart(newCart.id, createCartDto.cartOptions);

      return new CartDto(newCart, [], cartRequiedOptions, [], cartOptions);
    } else {
      const ExistRequriedOptions = cart.cartRequiredOptions.filter((d) =>
        createCartDto.cartRequiredOptions.some((c) => c.productRequiredOptionId === d.productRequiredOptionId),
      );
      const notExistRequriedOptions = createCartDto.cartRequiredOptions.filter(
        (d) => !cart.cartRequiredOptions.some((c) => c.productRequiredOptionId === d.productRequiredOptionId),
      );

      const existRequiredIds = ExistRequriedOptions.map((e) => e.id);
      const updateRequiredOptions = await this.cartRequiredOptionRepository.increaseCount(existRequiredIds);
      const newRequiredOptions = await this.cartRequiredOptionRepository.saveCart(cart.id, notExistRequriedOptions);

      if (createCartDto.cartOptions.length) {
        const ExistOptions = cart.cartOptions.filter((d) =>
          createCartDto.cartOptions.some((c) => c.productOptionId === d.productOptionId),
        );
        const notExistOptions = createCartDto.cartOptions.filter(
          (d) => !cart.cartOptions.some((c) => c.productOptionId === d.productOptionId),
        );

        const existOptionIds = ExistOptions.map((e) => e.id);
        const updateOptions = await this.cartOptionRepository.increaseCount(existOptionIds);
        const newOptions = await this.cartOptionRepository.saveCart(cart.id, notExistOptions);

        return new CartDto(cart, updateRequiredOptions, newRequiredOptions, updateOptions, newOptions);
      }

      return new CartDto(cart, updateRequiredOptions, newRequiredOptions, [], []);
    }
  }
  /**
   * 유저의 장바구니를 읽습니다.
   *
   * @param userId 해당 유저의 카트를 조회한다.
   */
  async readCarts(userId: number) {
    /**
     * 유저의 모든 장바구니 내역을 조회한 다음,
     * 배송비 단위로 묶일 수 있는 장바구니 상품들로 묶어주어야 한다.
     */
    const carts = await this.cartRepository.find();
    const cartsGroupByProductBundleId = this.groupByProductBundle(carts);

    const deliveryFee = cartsGroupByProductBundleId.map((el) => el.fixedDeliveryFee).reduce((acc, cur) => acc + cur, 0);
    return { carts: cartsGroupByProductBundleId, deliveryFee };
  }

  /**
   * 이미 담긴 장바구니 상품의 수량을 변경한다.
   *
   * @param userId
   * @param cartId
   * @param cartOptionId
   * @param cartType
   * @param count
   */
  async updateCart(
    userId: number,
    cartId: number,
    cartOptionId: number,
    cartType: 'option' | 'requiredOption',
    count: number,
  ) {}

  /**
   * 장바구니를 조회할 때, 장바구니 - 상품 - 상품 묶음을 모두 조인해서 가져온 다음,
   * 서버 로직을 이용해서 상품 묶음으로 이를 묶어야 합니다.
   */
  private groupByProductBundle(carts: any[]): {
    /**
     * 상품 묶음의 아이디
     * 어떤 번들에도 속하지 않은 상품이 존재할 경우에는 id는 null로 할 수도 있고,
     * 또는 모든 판매자가 어떤 번들에도 속하지 않는 '상품 묶음'을 디폴트로 가지고 있다고 가정할 수도 있다.
     */
    id: number | null;

    /**
     * 배송비 기준
     */
    chargeStandard: string;

    /**
     * 배송비 기준에 따라 장바구니 내부에서 최소/최대 배송비를 꺼낸 값
     * 보통의 커머스들은, 각 상품 묶음 별 배송비를 따로 보여주며, 묶음 배송 배송비의 총합을 따로 보여준다.
     * 따라서 여기서도 각 묶음 상품 그룹 별 배송비를 보여준다.
     */
    fixedDeliveryFee: number;

    /**
     * 속한 장바구니 상품
     */
    carts: {
      id: number;
      product: {
        id: number;
      };
      cartRequiredOptions: { id: number; price: number; count: number }[];
      cartOptions: { id: number; price: number; count: number }[];
    }[];
  }[] {
    const productBundles = [] as any;
    return productBundles.map((productBundle) => {
      return { ...productBundle, fixedDeliveryFee: this.productBundleFixDeliveryFee(productBundle) };
    }) as any;
  }

  /**
   * 해당 번들과 내부 장바구니 상품들을 이용해 번들의 최종적인 배송비를 계산한다.
   *
   * @param productBundle
   * @returns
   */
  private productBundleFixDeliveryFee(
    productBundle: Pick<ProductBundleEntity, 'id' | 'chargeStandard'> & {
      carts: any[];
    },
  ): number {
    return 0;
  }

  /**
   * 장바구니에서 상품을 지웁니다.
   * 상품은 배열로 아이디를 전달해서 한 번에 지울 수 있습니다.
   * 장바구니에서 상품들을 체크박스로 체크해서 한꺼번에 지우는 걸 상상해주세요.
   * 장바구니는 soft-delete되어야 합니다.
   *
   * @param userId 상품을 지울 유저의 아이디
   * @param productIds 상품 아이디 배열
   */
  deleteCart(userId: number, productIds: number[]) {}

  /**
   * 장바구니 상품의 옵션만을 제거한다.
   * 제거할 때에는 반드시 필수 옵션이 1개 이상 남아 있어야 한다.
   *
   * @param userId
   * @param cartId
   * @param cartOptionId
   * @param cartType
   */
  deleteCartOption(userId: number, cartId: number, cartOptionId: number, cartType: 'option' | 'requiredOption') {}
}
